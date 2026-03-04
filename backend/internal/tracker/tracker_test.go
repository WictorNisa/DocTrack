package tracker_test

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/wictorn/doctrack/internal/config"
	"github.com/wictorn/doctrack/internal/tracker"
)

func TestScanAndDiff(t *testing.T) {
	tmp := t.TempDir()

	// Create initial files
	if err := os.WriteFile(filepath.Join(tmp, "main.go"), []byte("package main\n"), 0o644); err != nil {
		t.Fatal(err)
	}

	cfg := &config.Config{
		Include: []string{"**/*.go"},
		Exclude: []string{},
	}

	snap1, err := tracker.Scan(tmp, cfg)
	if err != nil {
		t.Fatalf("Scan: %v", err)
	}
	if len(snap1.Files) == 0 {
		t.Error("expected at least one file in snapshot")
	}

	// Modify a file
	if err := os.WriteFile(filepath.Join(tmp, "main.go"), []byte("package main\n\nfunc main() {}\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	// Add a new file
	if err := os.WriteFile(filepath.Join(tmp, "other.go"), []byte("package main\n"), 0o644); err != nil {
		t.Fatal(err)
	}

	snap2, err := tracker.Scan(tmp, cfg)
	if err != nil {
		t.Fatalf("Scan2: %v", err)
	}

	changed := tracker.Diff(snap1, snap2)
	if len(changed) == 0 {
		t.Error("expected changes after file modifications")
	}

	// Verify we detect the modification and addition
	statuses := make(map[string]tracker.Status)
	for _, c := range changed {
		statuses[filepath.Base(c.Path)] = c.Status
	}
	if statuses["main.go"] != tracker.StatusModified {
		t.Errorf("main.go status = %v, want modified", statuses["main.go"])
	}
	if statuses["other.go"] != tracker.StatusAdded {
		t.Errorf("other.go status = %v, want added", statuses["other.go"])
	}
}

func TestAllFiles(t *testing.T) {
	tmp := t.TempDir()
	if err := os.WriteFile(filepath.Join(tmp, "a.go"), []byte("package a\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	cfg := &config.Config{Include: []string{"**/*.go"}}
	snap, err := tracker.Scan(tmp, cfg)
	if err != nil {
		t.Fatal(err)
	}
	all := tracker.AllFiles(snap)
	if len(all) == 0 {
		t.Error("AllFiles returned empty for non-empty snapshot")
	}
}
