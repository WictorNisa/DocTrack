package cmd

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/charmbracelet/huh"
	"github.com/spf13/cobra"
	"github.com/wictorn/doctrack/internal/config"
)

var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Interactive setup wizard for DocTrack",
	RunE:  runInit,
}

func init() {
	rootCmd.AddCommand(initCmd)
}

func runInit(cmd *cobra.Command, args []string) error {
	cfgPath, _ := cmd.Root().PersistentFlags().GetString("config")
	if cfgPath == "" {
		cfgPath = ".doctrack.yaml"
	}
	projectType := detectProjectType(".")
	var (
		provider string
		apiKey   string
		docsDir  string
		useConf  bool
	)
	form := huh.NewForm(
		huh.NewGroup(
			huh.NewSelect[string]().
				Title("AI Provider").
				Options(
					huh.NewOption("OpenAI (GPT-4o)", "openai"),
					huh.NewOption("Anthropic (Claude)", "anthropic"),
				).
				Value(&provider),
			huh.NewInput().
				Title("API Key").
				Description("Stored locally. Use env:VAR_NAME to read from environment.").
				EchoMode(huh.EchoModePassword).
				Value(&apiKey),
			huh.NewInput().
				Title("Documentation directory").
				Placeholder("docs").
				Value(&docsDir),
			huh.NewConfirm().
				Title("Configure Confluence integration?").
				Value(&useConf),
		),
	)
	if err := form.Run(); err != nil {
		return fmt.Errorf("init wizard: %w", err)
	}
	if docsDir == "" {
		docsDir = "docs"
	}
	defaultModel := "gpt-4o"
	if provider == "anthropic" {
		defaultModel = "claude-3-5-sonnet-20241022"
	}
	includes := defaultIncludes(projectType)
	cfg := &config.Config{
		Version:  1,
		Provider: provider,
		Model:    defaultModel,
		DocsDir:  docsDir,
		Mapping:  "mirror",
		Include:  includes,
		Exclude:  []string{"vendor/**", "node_modules/**", "*.test.*", "**/*_test.go"},
	}
	cfg.Providers.OpenAI.APIKey = ""
	cfg.Providers.Anthropic.APIKey = ""
	if provider == "openai" {
		cfg.Providers.OpenAI.APIKey = apiKey
	} else {
		cfg.Providers.Anthropic.APIKey = apiKey
	}
	if useConf {
		cfg.Confluence = &config.ConfluenceConfig{}
		fmt.Println("Add your Confluence credentials to", cfgPath, "after setup.")
	}
	if err := config.Write(cfgPath, cfg); err != nil {
		return fmt.Errorf("writing config: %w", err)
	}
	addToGitignore(cfgPath)
	fmt.Printf("\n✓ DocTrack configured! Run \"doctrack sync\" to generate documentation.\n")
	fmt.Printf("  Project type: %s | Provider: %s | Docs: %s\n", projectType, provider, docsDir)
	return nil
}

func detectProjectType(dir string) string {
	// Ordered slice ensures deterministic results when multiple markers exist.
	checks := []struct {
		file  string
		pType string
	}{
		{"go.mod", "go"},
		{"Cargo.toml", "rust"},
		{"pyproject.toml", "python"},
		{"requirements.txt", "python"},
		{"pom.xml", "java"},
		{"package.json", "node"},
	}
	for _, c := range checks {
		if _, err := os.Stat(filepath.Join(dir, c.file)); err == nil {
			return c.pType
		}
	}
	return "generic"
}

func defaultIncludes(projectType string) []string {
	switch projectType {
	case "go":
		return []string{"**/*.go"}
	case "node":
		return []string{"**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"}
	case "python":
		return []string{"**/*.py"}
	case "rust":
		return []string{"**/*.rs"}
	case "java":
		return []string{"**/*.java"}
	default:
		return []string{"**/*.go", "**/*.ts", "**/*.js", "**/*.py", "**/*.rs"}
	}
}

func addToGitignore(cfgPath string) {
	gi := ".gitignore"
	data, err := os.ReadFile(gi)
	if err != nil {
		// .gitignore doesn't exist — create it with the config path
		if os.IsNotExist(err) {
			content := fmt.Sprintf("# DocTrack config (contains API keys)\n%s\n", cfgPath)
			_ = os.WriteFile(gi, []byte(content), 0o644)
		}
		return
	}
	if strings.Contains(string(data), cfgPath) {
		return
	}
	f, err := os.OpenFile(gi, os.O_APPEND|os.O_WRONLY, 0o644)
	if err != nil {
		return
	}
	defer f.Close()
	fmt.Fprintf(f, "\n# DocTrack config (contains API keys)\n%s\n", cfgPath)
}
