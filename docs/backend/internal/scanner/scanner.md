---
doctrack:
    source: backend/internal/scanner/scanner.go
    source_hash: f6276df1bee4128c6be9f457bc28e0d406e4200f703202b43d544ce73e7906e4
    last_sync: 2026-02-27T13:38:00.071583Z
    schema: 1
---
# backend/internal/scanner/scanner
<!-- doctrack:user:start -->
<!-- doctrack:user:end -->
<!-- doctrack:auto:start -->
## Package scanner

The `scanner` package detects and redacts secrets from diff output.

### Functions

#### `ScanForSecrets(diff string) []Finding`

`ScanForSecrets` scans a unified diff string and returns all detected secrets.

Parameters:
- `diff` (string): The unified diff to scan.

Returns:
- `[]Finding`: A slice of `Finding` structs, each representing a detected secret.

#### `Redact(diff string, findings []Finding) string`

`Redact` replaces detected secrets in a diff with `[REDACTED:type]` placeholders.

Parameters:
- `diff` (string): The unified diff to redact.
- `findings` ([]Finding): The list of detected secrets to redact.

Returns:
- `string`: The redacted diff.

### Types

#### `Finding`

`Finding` describes a detected secret.

Fields:
- `Type` (string): The type of the detected secret.
- `Line` (int): The line number where the secret was detected.
- `Match` (string): The actual secret value that was detected.

#### `pattern`

`pattern` represents a regular expression pattern used to detect secrets.

Fields:
- `name` (string): The name of the pattern.
- `re` (`*regexp.Regexp`): The compiled regular expression.
<!-- doctrack:auto:end -->
