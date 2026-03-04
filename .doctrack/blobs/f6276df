// Package scanner detects and redacts secrets from diff output.
package scanner

import (
	"fmt"
	"regexp"
	"strings"
	"sync"
)

// Finding describes a detected secret.
type Finding struct {
	Type  string
	Line  int
	Match string
}

type pattern struct {
	name string
	re   *regexp.Regexp
}

var (
	once     sync.Once
	patterns []pattern
)

func initPatterns() {
	once.Do(func() {
		defs := []struct {
			name string
			expr string
		}{
			{"aws-access-key", `AKIA[0-9A-Z]{16}`},
			{"aws-secret-key", `(?i)aws.{0,20}secret.{0,20}['"][0-9a-zA-Z/+]{40}['"]`},
			{"openai-key", `sk-[a-zA-Z0-9]{20,}T3BlbkFJ[a-zA-Z0-9]{20,}`},
			{"openai-key-v2", `sk-proj-[a-zA-Z0-9_-]{20,}`},
			{"anthropic-key", `sk-ant-[a-zA-Z0-9_-]{20,}`},
			{"github-token", `gh[pousr]_[A-Za-z0-9_]{36,}`},
			{"private-key", `-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY`},
			{"stripe-key", `(?:sk|pk)_(test|live)_[a-zA-Z0-9]{20,}`},
			{"slack-token", `xox[baprs]-[0-9a-zA-Z-]{10,}`},
			{"generic-password", `(?i)(?:password|passwd|pwd)\s*[:=]\s*['"][^'"]{6,}['"]`},
			{"generic-token", `(?i)(?:token|api_key|apikey|secret)\s*[:=]\s*['"][^'"]{8,}['"]`},
			{"connection-string", `(?i)(?:mongodb|postgres|mysql|redis):\/\/[^@\s]+@[^\s]+`},
		}
		for _, d := range defs {
			re, err := regexp.Compile(d.expr)
			if err != nil {
				continue
			}
			patterns = append(patterns, pattern{name: d.name, re: re})
		}
	})
}

// ScanForSecrets scans a unified diff string and returns all detected secrets.
func ScanForSecrets(diff string) []Finding {
	initPatterns()
	var findings []Finding
	for i, line := range splitLines(diff) {
		for _, p := range patterns {
			if m := p.re.FindString(line); m != "" {
				findings = append(findings, Finding{Type: p.name, Line: i + 1, Match: m})
			}
		}
	}
	return findings
}

// Redact replaces detected secrets in diff with [REDACTED:type] placeholders.
func Redact(diff string, findings []Finding) string {
	initPatterns()
	if len(findings) == 0 {
		return diff
	}
	result := diff
	for _, f := range findings {
		result = strings.ReplaceAll(result, f.Match, fmt.Sprintf("[REDACTED:%s]", f.Type))
	}
	return result
}

func splitLines(s string) []string {
	return strings.Split(s, "\n")
}
