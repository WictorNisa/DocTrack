package cmd

import (
	"context"
	"errors"
	"fmt"
	"os"
	"sync"
	"sync/atomic"

	"github.com/spf13/cobra"
	"github.com/wictorn/doctrack/internal/ai"
	"github.com/wictorn/doctrack/internal/differ"
	"github.com/wictorn/doctrack/internal/docs"
	"github.com/wictorn/doctrack/internal/scanner"
	"github.com/wictorn/doctrack/internal/store"
	"github.com/wictorn/doctrack/internal/tracker"
)

var syncCmd = &cobra.Command{
	Use:   "sync",
	Short: "Sync documentation with source code changes",
	RunE:  runSync,
}

func init() {
	syncCmd.Flags().Bool("dry-run", false, "Show what would be updated without calling AI")
	syncCmd.Flags().Bool("confluence", false, "Push docs to Confluence after sync")
	syncCmd.Flags().Bool("no-confluence", false, "Skip Confluence even if configured")
	syncCmd.Flags().Bool("force", false, "Regenerate all docs, not just changed files")
	rootCmd.AddCommand(syncCmd)
}

func runSync(cmd *cobra.Command, args []string) error {
	cfg := configFromContext(cmd)
	dryRun, _ := cmd.Flags().GetBool("dry-run")
	force, _ := cmd.Flags().GetBool("force")

	snapshotPath := ".doctrack/snapshot.json"
	oldSnap, err := store.LoadSnapshot(snapshotPath)
	if err != nil {
		oldSnap = store.EmptySnapshot()
	}

	fmt.Print("Scanning... ")
	newSnap, err := tracker.Scan(".", cfg)
	if err != nil {
		return fmt.Errorf("scanning files: %w", err)
	}

	var changed []tracker.ChangedFile
	if force {
		changed = tracker.AllFiles(newSnap)
	} else {
		changed = tracker.Diff(oldSnap, newSnap)
	}
	if len(changed) == 0 {
		fmt.Println("\nEverything up to date.")
		return nil
	}
	fmt.Printf("%d tracked, %d changed\n", len(newSnap.Files), len(changed))

	mgr := docs.NewManager(cfg.DocsDir)
	mapper := docs.NewMapper(cfg.DocsDir)

	var jobs []syncJob
	var secretWarnings int
	for _, f := range changed {
		if f.Status == tracker.StatusDeleted {
			docPath := mapper.SourceToDocPath(f.Path)
			existing, err := mgr.Read(docPath)
			if err == nil {
				existing.Frontmatter.Doctrack.Deleted = true
				_ = mgr.Write(docPath, existing)
			}
			continue
		}
		docPath := mapper.SourceToDocPath(f.Path)
		existingDoc, _ := mgr.Read(docPath)
		if existingDoc != nil && !docs.IsStale(existingDoc, f.NewHash) && !force {
			fmt.Printf("  ○ %-40s (skipped, unchanged)\n", f.Path)
			continue
		}
		rawDiff, err := differ.Compute(".", f)
		if err != nil {
			fmt.Fprintf(os.Stderr, "warn: diff %s: %v\n", f.Path, err)
			continue
		}
		findings := scanner.ScanForSecrets(rawDiff)
		if len(findings) > 0 {
			secretWarnings++
			fmt.Fprintf(os.Stderr, "⚠ %d secret(s) redacted in %s\n", len(findings), f.Path)
		}
		redacted := scanner.Redact(rawDiff, findings)
		jobs = append(jobs, syncJob{f: f, diff: redacted, docPath: docPath})
		fmt.Printf("  ● %s\n", f.Path)
	}

	if len(jobs) == 0 {
		fmt.Println("Nothing to update.")
		return nil
	}
	if dryRun {
		printDryRun(jobs)
		return nil
	}

	provCfg := cfg.ActiveProviderConfig()
	provider, err := ai.NewProvider(cfg.Provider, cfg.Model, provCfg.APIKey, provCfg.BaseURL)
	if err != nil {
		return fmt.Errorf("creating AI provider: %w", err)
	}

	fmt.Println("Generating...")
	var (
		totalTokens int64
		errCount    int64
		printMu     sync.Mutex
		failedPaths sync.Map
	)
	sem := make(chan struct{}, 3)
	var wg sync.WaitGroup
	for _, j := range jobs {
		wg.Add(1)
		go func(j syncJob) {
			defer wg.Done()
			sem <- struct{}{}
			defer func() { <-sem }()
			tokens, err := syncOne(cmd.Context(), provider, mgr, cfg.DocsDir, j.f, j.diff, j.docPath)
			printMu.Lock()
			defer printMu.Unlock()
			if err != nil {
				fmt.Fprintf(os.Stderr, "  ✗ %s: %v\n", j.f.Path, err)
				atomic.AddInt64(&errCount, 1)
				failedPaths.Store(j.f.Path, true)
				return
			}
			fmt.Printf("  ✓ %-40s (%d tokens)\n", j.docPath, tokens)
			atomic.AddInt64(&totalTokens, int64(tokens))
		}(j)
	}
	wg.Wait()

	// Remove failed entries from the snapshot so they are retried on the next run.
	failedPaths.Range(func(key, _ any) bool {
		delete(newSnap.Files, key.(string))
		return true
	})

	if err := docs.RegenerateIndexes(cfg.DocsDir); err != nil {
		fmt.Fprintf(os.Stderr, "warn: regenerating indexes: %v\n", err)
	}
	if err := store.SaveSnapshot(snapshotPath, newSnap); err != nil {
		return fmt.Errorf("saving snapshot: %w", err)
	}

	updated := int64(len(jobs)) - errCount
	fmt.Printf("\n✓ %d doc(s) updated. ~%d tokens.\n", updated, totalTokens)
	if errCount > 0 {
		return errors.New("some files failed to sync")
	}
	return nil
}

func syncOne(ctx context.Context, provider ai.Provider, mgr *docs.Manager, docsDir string, f tracker.ChangedFile, diff, docPath string) (int, error) {
	existingDoc, _ := mgr.Read(docPath)
	var existingContent string
	if existingDoc != nil {
		existingContent = existingDoc.AutoSection
	}
	resp, err := provider.GenerateDocUpdate(ctx, ai.DocUpdateRequest{
		FilePath:    f.Path,
		Diff:        diff,
		ExistingDoc: existingContent,
		Language:    ai.LanguageFromPath(f.Path),
	})
	if err != nil {
		return 0, fmt.Errorf("AI generation: %w", err)
	}
	df := existingDoc
	if df == nil {
		df = docs.NewDocFile(f.Path, f.NewHash)
	} else {
		df.Frontmatter.Doctrack.SourceHash = f.NewHash
	}
	df.AutoSection = resp.Content
	if err := mgr.Write(docPath, df); err != nil {
		return 0, fmt.Errorf("writing doc: %w", err)
	}
	return resp.TokensUsed, nil
}

type syncJob struct {
	f       tracker.ChangedFile
	diff    string
	docPath string
}

func printDryRun(jobs []syncJob) {
	estTokens := 0
	for range jobs {
		estTokens += 500
	}
	fmt.Printf("\nDry run: %d file(s) would be updated (~%d estimated tokens)\n", len(jobs), estTokens)
}
