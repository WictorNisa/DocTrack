package docs_test

import (
	"testing"

	"github.com/wictorn/doctrack/internal/docs"
)

func TestNewDocFile(t *testing.T) {
	df := docs.NewDocFile("src/api/handler.go", "abc123")
	if df.Frontmatter.Doctrack.Source != "src/api/handler.go" {
		t.Errorf("source = %q", df.Frontmatter.Doctrack.Source)
	}
	if df.Frontmatter.Doctrack.SourceHash != "abc123" {
		t.Errorf("source_hash = %q", df.Frontmatter.Doctrack.SourceHash)
	}
	if df.Title == "" {
		t.Error("title should not be empty")
	}
}

func TestIsStale(t *testing.T) {
	df := docs.NewDocFile("src/foo.go", "hash1")
	if docs.IsStale(df, "hash1") {
		t.Error("IsStale should return false when hash matches")
	}
	if !docs.IsStale(df, "hash2") {
		t.Error("IsStale should return true when hash differs")
	}
}

func TestWriteAndRead(t *testing.T) {
	tmp := t.TempDir()
	mgr := docs.NewManager(tmp)
	df := docs.NewDocFile("src/foo.go", "abc123")
	df.AutoSection = "## Overview\n\nThis file does foo."
	df.UserSections = []string{"Custom notes here."}

	docPath := tmp + "/foo.md"
	if err := mgr.Write(docPath, df); err != nil {
		t.Fatalf("Write: %v", err)
	}

	loaded, err := mgr.Read(docPath)
	if err != nil {
		t.Fatalf("Read: %v", err)
	}
	if loaded.AutoSection == "" {
		t.Error("AutoSection should not be empty after round-trip")
	}
	if loaded.Frontmatter.Doctrack.SourceHash != "abc123" {
		t.Errorf("source_hash = %q after round-trip", loaded.Frontmatter.Doctrack.SourceHash)
	}
}

func TestMapperSourceToDocPath(t *testing.T) {
	mapper := docs.NewMapper("docs")
	tests := []struct {
		input string
		want  string
	}{
		{"src/api/handler.go", "docs/api/handler.md"},
		{"main.go", "docs/main.md"},
	}
	for _, tt := range tests {
		got := mapper.SourceToDocPath(tt.input)
		if got != tt.want {
			t.Errorf("SourceToDocPath(%q) = %q, want %q", tt.input, got, tt.want)
		}
	}
}
