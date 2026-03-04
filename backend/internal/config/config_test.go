package config_test

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/wictorn/doctrack/internal/config"
)

func TestLoadDefaults(t *testing.T) {
	tmp := t.TempDir()
	cfgPath := filepath.Join(tmp, ".doctrack.yaml")
	content := `version: 1
provider: openai
model: gpt-4o
docs_dir: docs
mapping: mirror
include:
  - "**/*.go"
exclude:
  - "vendor/**"
providers:
  openai:
    api_key: sk-test123456789012345
`
	if err := os.WriteFile(cfgPath, []byte(content), 0o600); err != nil {
		t.Fatal(err)
	}
	cfg, err := config.Load(cfgPath)
	if err != nil {
		t.Fatalf("Load: %v", err)
	}
	if cfg.Provider != "openai" {
		t.Errorf("provider = %q, want openai", cfg.Provider)
	}
	if cfg.Model != "gpt-4o" {
		t.Errorf("model = %q, want gpt-4o", cfg.Model)
	}
	if cfg.DocsDir != "docs" {
		t.Errorf("docs_dir = %q, want docs", cfg.DocsDir)
	}
}

func TestLoadEnvOverride(t *testing.T) {
	tmp := t.TempDir()
	cfgPath := filepath.Join(tmp, ".doctrack.yaml")
	content := `version: 1
provider: openai
model: gpt-4o
docs_dir: docs
providers:
  openai:
    api_key: env:MY_TEST_KEY
`
	if err := os.WriteFile(cfgPath, []byte(content), 0o600); err != nil {
		t.Fatal(err)
	}
	t.Setenv("MY_TEST_KEY", "sk-resolved-key")
	cfg, err := config.Load(cfgPath)
	if err != nil {
		t.Fatalf("Load: %v", err)
	}
	// Load() must preserve the env: reference so that Write() never leaks
	// the plaintext API key back to disk.
	if cfg.Providers.OpenAI.APIKey != "env:MY_TEST_KEY" {
		t.Errorf("raw api_key = %q, want env:MY_TEST_KEY (env: reference must be preserved after Load)", cfg.Providers.OpenAI.APIKey)
	}
	// ActiveProviderConfig() resolves env: references lazily.
	if got := cfg.ActiveProviderConfig().APIKey; got != "sk-resolved-key" {
		t.Errorf("ActiveProviderConfig().APIKey = %q, want sk-resolved-key", got)
	}
}

func TestLoadMissingFile(t *testing.T) {
	_, err := config.Load("/nonexistent/.doctrack.yaml")
	if err == nil {
		t.Error("expected error for missing config, got nil")
	}
}

func TestWrite(t *testing.T) {
	tmp := t.TempDir()
	cfgPath := filepath.Join(tmp, ".doctrack.yaml")
	cfg := &config.Config{
		Version:  1,
		Provider: "anthropic",
		Model:    "claude-3-5-sonnet-20241022",
		DocsDir:  "docs",
		Mapping:  "mirror",
	}
	cfg.Providers.Anthropic.APIKey = "sk-ant-test"
	if err := config.Write(cfgPath, cfg); err != nil {
		t.Fatalf("Write: %v", err)
	}
	loaded, err := config.Load(cfgPath)
	if err != nil {
		t.Fatalf("Load after Write: %v", err)
	}
	if loaded.Provider != "anthropic" {
		t.Errorf("provider = %q, want anthropic", loaded.Provider)
	}
}
