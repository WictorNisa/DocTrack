// Package ai provides a unified interface to AI providers.
package ai

import (
	"fmt"
	"path/filepath"
	"strings"
)

const systemPrompt = `You are a technical documentation assistant. Given a source code diff and existing documentation, update ONLY the auto-generated section of the documentation.

Rules:
- Output ONLY the content for the auto-generated section. No markdown fences, no preamble.
- Describe what the code does, its public API, parameters, return values, and key behaviors.
- Be concise but complete. Use the same language as the existing documentation if present.
- Never include secrets, credentials, or sensitive data you may see in the diff.
- Format: plain Markdown. Use headings, lists, and code spans where helpful.`

// buildUserPrompt assembles the user turn sent to the AI.
func buildUserPrompt(req DocUpdateRequest) string {
	var sb strings.Builder
	fmt.Fprintf(&sb, "File: %s\n", req.FilePath)
	fmt.Fprintf(&sb, "Language: %s\n\n", req.Language)
	if req.ExistingDoc != "" {
		fmt.Fprintf(&sb, "Existing documentation:\n%s\n\n", req.ExistingDoc)
	}
	fmt.Fprintf(&sb, "Diff:\n%s\n", req.Diff)
	return sb.String()
}

// LanguageFromPath returns a human-readable language name derived from file extension.
func LanguageFromPath(path string) string {
	ext := strings.ToLower(strings.TrimPrefix(filepath.Ext(path), "."))
	switch ext {
	case "go":
		return "Go"
	case "ts", "tsx":
		return "TypeScript"
	case "js", "jsx":
		return "JavaScript"
	case "py":
		return "Python"
	case "rs":
		return "Rust"
	case "java":
		return "Java"
	case "rb":
		return "Ruby"
	case "cs":
		return "C#"
	case "cpp", "cc", "cxx":
		return "C++"
	case "c":
		return "C"
	case "sh", "bash":
		return "Shell"
	case "yaml", "yml":
		return "YAML"
	case "json":
		return "JSON"
	default:
		if ext != "" {
			return ext
		}
		return "text"
	}
}
