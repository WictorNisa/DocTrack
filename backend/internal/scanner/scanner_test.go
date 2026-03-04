package scanner_test

import (
	"strings"
	"testing"

	"github.com/wictorn/doctrack/internal/scanner"
)

func TestScanForSecrets(t *testing.T) {
	tests := []struct {
		name    string
		diff    string
		wantAny bool
	}{
		{
			name:    "no secrets",
			diff:    "+func foo() { return 42 }",
			wantAny: false,
		},
		{
			name:    "openai key",
			diff:    "+api_key = sk-proj-abcdefghijklmnopqrstuvwxyz123456",
			wantAny: true,
		},
		{
			name:    "aws access key",
			diff:    "+AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE",
			wantAny: true,
		},
		{
			name:    "anthropic key",
			diff:    "+key = sk-ant-api03-abcdefghijklmnopqrstuvwxyz",
			wantAny: true,
		},
		{
			name:    "github token",
			diff:    "+token = ghp_abcdefghijklmnopqrstuvwxyz1234567890abcdef",
			wantAny: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			findings := scanner.ScanForSecrets(tt.diff)
			got := len(findings) > 0
			if got != tt.wantAny {
				t.Errorf("ScanForSecrets(%q) found=%v, wantAny=%v; findings=%v",
					tt.diff, got, tt.wantAny, findings)
			}
		})
	}
}

func TestRedact(t *testing.T) {
	diff := "+api_key = sk-proj-abcdefghijklmnopqrstuvwxyz123456"
	findings := scanner.ScanForSecrets(diff)
	if len(findings) == 0 {
		t.Skip("no findings to redact")
	}
	redacted := scanner.Redact(diff, findings)
	if redacted == diff {
		t.Error("Redact returned unchanged diff")
	}
	for _, f := range findings {
		if strings.Contains(redacted, f.Match) {
			t.Errorf("secret %q still present after redaction", f.Match)
		}
	}
}
