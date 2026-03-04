// Package config loads and validates DocTrack configuration.
// Resolution order: CLI flags > env vars (DOCTRACK_*) > project .doctrack.yaml
// > global ~/.config/doctrack/config.yaml > defaults.
package config

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"gopkg.in/yaml.v3"
)

const (
	defaultDocsDir = "docs"
	defaultMapping = "mirror"
	schemaVersion  = 1
)

// Config is the top-level DocTrack configuration.
type Config struct {
	Version    int               `yaml:"version"`
	Provider   string            `yaml:"provider"`
	Model      string            `yaml:"model"`
	DocsDir    string            `yaml:"docs_dir"`
	Mapping    string            `yaml:"mapping"`
	Include    []string          `yaml:"include"`
	Exclude    []string          `yaml:"exclude"`
	Providers  ProvidersConfig   `yaml:"providers"`
	Confluence *ConfluenceConfig `yaml:"confluence,omitempty"`
}

// ProvidersConfig holds per-provider settings.
type ProvidersConfig struct {
	OpenAI    ProviderConfig `yaml:"openai"`
	Anthropic ProviderConfig `yaml:"anthropic"`
}

// ProviderConfig holds settings for a single AI provider.
type ProviderConfig struct {
	APIKey  string `yaml:"api_key"`
	BaseURL string `yaml:"base_url"`
	Model   string `yaml:"model"`
}

// ConfluenceConfig holds Confluence integration settings.
type ConfluenceConfig struct {
	BaseURL  string `yaml:"base_url"`
	SpaceID  string `yaml:"space_id"`
	Email    string `yaml:"email"`
	APIToken string `yaml:"api_token"`
	ParentID string `yaml:"parent_id,omitempty"`
}

// Load reads config from the given path (or discovers it) and applies
// environment variable overrides.
func Load(cfgPath string) (*Config, error) {
	if cfgPath == "" {
		cfgPath = ".doctrack.yaml"
	}

	cfg, err := readFile(cfgPath)
	if err != nil {
		if os.IsNotExist(err) {
			global, gerr := globalConfigPath()
			if gerr == nil {
				if cfg, gerr = readFile(global); gerr != nil && !os.IsNotExist(gerr) {
					return nil, fmt.Errorf("reading global config: %w", gerr)
				}
			}
			if cfg == nil {
				return nil, os.ErrNotExist
			}
		} else {
			return nil, fmt.Errorf("reading config %s: %w", cfgPath, err)
		}
	}

	applyDefaults(cfg)
	applyEnvOverrides(cfg)
	return cfg, nil
}

// Write serialises cfg to path with 0600 permissions.
func Write(path string, cfg *Config) error {
	data, err := yaml.Marshal(cfg)
	if err != nil {
		return fmt.Errorf("marshalling config: %w", err)
	}
	if err := os.MkdirAll(filepath.Dir(path), 0700); err != nil {
		return fmt.Errorf("creating config dir: %w", err)
	}
	f, err := os.OpenFile(path, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0600)
	if err != nil {
		return fmt.Errorf("opening config file: %w", err)
	}
	if _, err := f.Write(data); err != nil {
		f.Close()
		return fmt.Errorf("writing config: %w", err)
	}
	if err := f.Close(); err != nil {
		return fmt.Errorf("closing config file: %w", err)
	}
	return nil
}

// CheckPermissions warns if a config file containing secrets is world-readable.
func CheckPermissions(path string) {
	info, err := os.Stat(path)
	if err != nil {
		return
	}
	if info.Mode().Perm()&0o077 != 0 {
		fmt.Fprintf(os.Stderr, "warning: %s has permissions %o — should be 0600 (contains secrets)\n",
			path, info.Mode().Perm())
	}
}

// ActiveProviderConfig returns the ProviderConfig for the active provider.
// API key references (env:VAR) are resolved here — never at load time —
// so raw values are never written back to disk by config set/write operations.
func (c *Config) ActiveProviderConfig() ProviderConfig {
	var pc ProviderConfig
	var fallbackEnv string
	switch strings.ToLower(c.Provider) {
	case "anthropic":
		pc = c.Providers.Anthropic
		fallbackEnv = "ANTHROPIC_API_KEY"
	default:
		pc = c.Providers.OpenAI
		fallbackEnv = "OPENAI_API_KEY"
	}
	pc.APIKey = resolveKey(pc.APIKey, fallbackEnv)
	return pc
}

func readFile(path string) (*Config, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	CheckPermissions(path)

	var cfg Config
	dec := yaml.NewDecoder(f)
	dec.KnownFields(false)
	if err := dec.Decode(&cfg); err != nil {
		return nil, fmt.Errorf("parsing %s: %w", path, err)
	}
	return &cfg, nil
}

func applyDefaults(cfg *Config) {
	cfg.Version = schemaVersion
	if cfg.DocsDir == "" {
		cfg.DocsDir = defaultDocsDir
	}
	if cfg.Mapping == "" {
		cfg.Mapping = defaultMapping
	}
	if cfg.Provider == "" {
		cfg.Provider = "openai"
	}
	if len(cfg.Include) == 0 {
		cfg.Include = []string{"**/*.go", "**/*.js", "**/*.ts", "**/*.py", "**/*.rs"}
	}
}

func applyEnvOverrides(cfg *Config) {
	if v := os.Getenv("DOCTRACK_PROVIDER"); v != "" {
		cfg.Provider = v
	}
	if v := os.Getenv("DOCTRACK_DOCS_DIR"); v != "" {
		cfg.DocsDir = v
	}
	if v := os.Getenv("DOCTRACK_MODEL"); v != "" {
		cfg.Model = v
	}
}

func resolveKey(raw, fallbackEnv string) string {
	if strings.HasPrefix(raw, "env:") {
		return os.Getenv(strings.TrimPrefix(raw, "env:"))
	}
	if raw != "" {
		return raw
	}
	return os.Getenv(fallbackEnv)
}

func globalConfigPath() (string, error) {
	home, err := os.UserHomeDir()
	if err != nil {
		return "", fmt.Errorf("finding home dir: %w", err)
	}
	return filepath.Join(home, ".config", "doctrack", "config.yaml"), nil
}
