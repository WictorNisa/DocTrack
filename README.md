# DocTrack

**Keep documentation in sync with your code. Automatically. Locally. Privately.**

DocTrack is a CLI tool that detects changed source files, computes diffs, redacts secrets, and sends the diffs to an AI provider to generate or update Markdown documentation. Everything runs on your machine with your own API key. No server, no telemetry, no vendor lock-in.

```
Source files --> change detection (SHA-256) --> unified diff --> secret scan + redact
     --> AI provider (OpenAI / Anthropic) --> Markdown docs written locally
                                                   --> (optional) Confluence push
```

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [How It Works](#how-it-works)
- [Commands](#commands)
- [Configuration](#configuration)
- [Generated Doc Format](#generated-doc-format)
- [Secret Detection](#secret-detection)
- [Confluence Integration](#confluence-integration)
- [Building from Source](#building-from-source)
- [Project Structure](#project-structure)
- [License](#license)

---

## Installation

```bash
npm install -g doctrack
```

Installs the correct pre-built binary for your platform (macOS, Linux, Windows).

Requires Node.js 16+.

---

## Quick Start

```bash
# Interactive setup wizard
doctrack init

# Generate docs for changed files
doctrack sync

# Preview changes without calling the AI
doctrack sync --dry-run

# Check what has changed since the last sync
doctrack diff
```

---

## How It Works

1. **Scan** -- walks your source tree, hashing every tracked file. Uses `git ls-files` when available for speed.
2. **Diff** -- computes a unified diff against the last snapshot. Unchanged files are skipped entirely.
3. **Redact** -- scans every diff for secrets (API keys, tokens, private keys) and replaces them with `[REDACTED:type]` before anything leaves your machine.
4. **Generate** -- sends the redacted diff and existing doc content to your AI provider. Only the auto-generated section is replaced; your hand-written notes are never touched.
5. **Write** -- patches the Markdown file and updates the snapshot so the file is skipped on future runs unless it changes again.
6. **Push** (optional) -- sends updated docs to Confluence via `--confluence`.

---

## Commands

### `doctrack init`

Interactive setup wizard. Auto-detects your project type (Go, Node, Python, Rust, Java) and pre-populates include patterns. Writes `.doctrack.yaml` with `0600` permissions and adds it to `.gitignore`.

### `doctrack sync`

The main command. Scans files, diffs against the last snapshot, redacts secrets, calls the AI, and writes updated docs.

| Flag | Description |
|---|---|
| `--dry-run` | Show what would be updated and estimate token usage. No API calls. |
| `--force` | Regenerate docs for all tracked files, ignoring the snapshot. |
| `--confluence` | Push updated docs to Confluence after sync. |
| `--no-confluence` | Skip Confluence push even if configured. |

Example output:

```
Scanning... 142 tracked, 5 changed
  * src/api/handler.go
  - src/config/config.go          (skipped, unchanged)
  ! 1 secret(s) redacted in src/db/queries.go
Generating...
  + docs/api/handler.md           (820 tokens)

4 doc(s) updated. ~2,350 tokens.
```

### `doctrack diff`

Shows which files have changed since the last sync without generating documentation.

| Flag | Description |
|---|---|
| `--patch` | Show the full unified diff for each changed file. |

### `doctrack config`

Inspect and modify configuration from the CLI.

```bash
doctrack config list              # Show all values (keys are masked)
doctrack config get provider      # Get a single value
doctrack config set model gpt-4o  # Set a single value
```

### `doctrack version`

```bash
doctrack version
# doctrack version 0.1.0 (commit: a1b2c3d, built: 2026-03-20T14:30:00Z)
```

### Global Flags

| Flag | Description |
|---|---|
| `-q`, `--quiet` | Errors only. |
| `-v`, `--verbose` | Detailed output. |
| `--debug` | Full debug output including HTTP traces. |
| `--json` | Machine-readable JSON output. |
| `--config <path>` | Use a specific config file instead of `.doctrack.yaml`. |

---

## Configuration

DocTrack looks for `.doctrack.yaml` in the current directory, then falls back to `~/.config/doctrack/config.yaml`.

```yaml
version: 1
provider: openai          # openai | anthropic
model: gpt-4o
docs_dir: docs
mapping: mirror

include:
  - "**/*.go"
  - "**/*.ts"

exclude:
  - "vendor/**"
  - "node_modules/**"
  - "**/*_test.go"

providers:
  openai:
    api_key: "env:OPENAI_API_KEY"   # reads from environment variable
    base_url: ""                     # optional: Ollama / Azure / LiteLLM endpoint
  anthropic:
    api_key: "env:ANTHROPIC_API_KEY"

confluence:
  base_url: "https://yourteam.atlassian.net"
  space_id: "65538"
  email: "you@example.com"
  api_token: "env:CONFLUENCE_API_TOKEN"
  parent_id: "123456"
```

**Config resolution order:** CLI flag > `DOCTRACK_*` env var > `.doctrack.yaml` > `~/.config/doctrack/config.yaml` > defaults.

**API key formats:**

| Format | Meaning |
|---|---|
| `env:MY_VAR` | Read from environment variable `MY_VAR` |
| `sk-...` | Literal key stored in config |
| *(empty)* | Falls back to `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` |

API key references (`env:VAR`) are resolved lazily at runtime and never written back to disk as plaintext.

---

## Generated Doc Format

Each generated Markdown file uses YAML frontmatter and HTML comment markers. User-owned sections are never overwritten.

```markdown
---
doctrack:
  source: "src/api/handler.go"
  source_hash: "a1b2c3d4"
  last_sync: "2026-03-20T14:30:00Z"
  schema: 1
---

# api/handler

<!-- doctrack:user:start -->
Your hand-written notes go here. DocTrack never touches this section.
<!-- doctrack:user:end -->

<!-- doctrack:auto:start -->
AI-generated content is placed here and replaced on every sync.
<!-- doctrack:auto:end -->
```

- `doctrack:auto` sections are replaced on every sync.
- `doctrack:user` sections are preserved exactly as written.
- `source_hash` is compared before calling the AI. If it matches, the file is skipped.

---

## Secret Detection

Every diff is scanned before it is sent to the AI. Detected secrets are replaced with `[REDACTED:type]`. Coverage includes:

- AWS access keys (`AKIA...`)
- OpenAI keys (`sk-...`)
- Anthropic keys (`sk-ant-...`)
- GitHub tokens (`ghp_`, `gho_`, `ghu_`, `ghs_`, `ghr_`)
- Private key blocks (`-----BEGIN ... PRIVATE KEY-----`)
- Connection strings and DSNs
- Generic password/token assignments
- Slack and Stripe tokens

Source files are never modified. A warning is printed to stderr for each finding.

You can also create a `.aiignore` file (same syntax as `.gitignore`) to exclude files from being tracked entirely.

---

## Confluence Integration

Push updated docs to Confluence after every sync:

```bash
doctrack sync --confluence
```

DocTrack maintains a page mapping manifest at `.doctrack/confluence-manifest.yaml`. On first push, it searches by title and creates pages if none exist. Subsequent syncs update pages in place. Pages with unchanged content hashes are skipped.

---

## Building from Source

Requires Go 1.22+.

```bash
cd backend
go build -o doctrack .
./doctrack version
```

Cross-compile for all platforms:

```bash
cd backend
make all        # Builds darwin-arm64, darwin-x64, linux-x64, win32-x64
make test       # Runs go test -race ./...
```

Binaries are placed in `npm/@doctrack/<platform>/bin/`.

---

## Project Structure

```
backend/                  Go CLI source code
  cmd/                    Cobra command definitions
  internal/               Private business logic
    ai/                   AI provider interface (OpenAI, Anthropic)
    config/               Config loading and resolution
    confluence/           Confluence REST client and Markdown converter
    differ/               Diff computation (git diff + fallback)
    docs/                 Doc file management and marker parsing
    scanner/              Secret detection and redaction
    store/                Snapshot persistence
    tracker/              File change detection (SHA-256, git-aware)
frontend/                 React marketing site (doctrack.dev)
npm/                      npm distribution packages
  doctrack/               Main wrapper package
  @doctrack/              Platform-specific binary packages
```

---

## Data and Privacy

- **No server.** Everything runs on your machine.
- **BYOK.** You use your own API key. Requests go directly to the AI provider.
- **Diffs only.** Full source files are never sent to the AI.
- **Secrets are redacted** before anything leaves your machine.
- **No telemetry.** No analytics. No tracking. No phone-home.

---

## License

Apache 2.0. See [LICENSE](LICENSE) for details.
