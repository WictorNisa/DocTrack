// Package cmd implements DocTrack's CLI commands via Cobra.
package cmd

import (
	"context"
	"fmt"
	"os"

	"github.com/charmbracelet/log"
	"github.com/spf13/cobra"
	"github.com/wictorn/doctrack/internal/config"
)

var (
	buildVersion = "dev"
	buildCommit  = "unknown"
	buildDate    = "unknown"
)

// SetBuildInfo passes version metadata from main.
func SetBuildInfo(version, commit, date string) {
	buildVersion = version
	buildCommit = commit
	buildDate = date
}

// flags holds parsed global flag values.
var flags struct {
	quiet   bool
	verbose bool
	debug   bool
	json    bool
	cfgPath string
}

// logger is the package-level structured logger.
var logger *log.Logger

// cfg is the loaded project config, available to all subcommands.
var cfg *config.Config

var rootCmd = &cobra.Command{
	Use:   "doctrack",
	Short: "Keep documentation in sync with code changes",
	Long: `DocTrack automatically generates and maintains Markdown documentation
by sending code diffs to an AI provider (OpenAI or Anthropic).
Run 'doctrack init' to get started.`,
	PersistentPreRunE: func(cmd *cobra.Command, _ []string) error {
		initLogger()
		// Skip config loading for commands that don't need it.
		if cmd.Name() == "init" || cmd.Name() == "version" || cmd.Name() == "help" {
			return nil
		}
		loaded, err := config.Load(flags.cfgPath)
		if err != nil {
			if os.IsNotExist(err) {
				return fmt.Errorf("no .doctrack.yaml found. Run 'doctrack init' to set up")
			}
			return fmt.Errorf("loading config: %w", err)
		}
		cfg = loaded
		cmd.SetContext(context.WithValue(cmd.Context(), contextKeyConfig, loaded))
		return nil
	},
}

// Execute is the entry point called from main.
func Execute() {
	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}

func init() {
	rootCmd.PersistentFlags().BoolVarP(&flags.quiet, "quiet", "q", false, "suppress all output except errors")
	rootCmd.PersistentFlags().BoolVarP(&flags.verbose, "verbose", "v", false, "verbose output")
	rootCmd.PersistentFlags().BoolVar(&flags.debug, "debug", false, "enable debug output including HTTP traces")
	rootCmd.PersistentFlags().BoolVar(&flags.json, "json", false, "machine-readable JSON output")
	rootCmd.PersistentFlags().StringVar(&flags.cfgPath, "config", "", "path to config file (default .doctrack.yaml)")
}

func initLogger() {
	styles := log.DefaultStyles()
	l := log.NewWithOptions(os.Stderr, log.Options{
		ReportTimestamp: flags.debug,
		Level:           resolveLogLevel(),
	})
	l.SetStyles(styles)
	logger = l
}

func resolveLogLevel() log.Level {
	switch {
	case flags.debug:
		return log.DebugLevel
	case flags.verbose:
		return log.InfoLevel
	case flags.quiet:
		return log.ErrorLevel
	default:
		return log.WarnLevel
	}
}

// contextKeyConfig is the context key for the loaded Config.
type contextKey string

const contextKeyConfig contextKey = "config"
