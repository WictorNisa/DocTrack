# DocTrack

DocTrack is a Go CLI tool that keeps your documentation in sync with code changes automatically. It detects modified source files, computes diffs, redacts secrets, and sends the diffs to an AI provider (OpenAI or Anthropic) to generate or update Markdown documentation — all on your machine with your own API key.

## How It Works

```
Source files → change detection (SHA-256) → unified diff → secret scan + redact
     → AI provider (OpenAI / Anthropic) → Markdown docs written locally
                                               → (optional) Confluence push
```

1. **Scan** — walks your source tree, hashing every tracked file (uses `git ls-files` when available)
2. **Diff** — computes a unified diff against the last snapshot
3. **Redact** — strips secrets from diffs before they leave your machine
4. **Generate** — calls the AI and gets back documentation content
5. **Write** — patches the auto-generated section of each Markdown file, leaving your hand-written notes untouched
6. **Save snapshot** — stores hashes so unchanged files are skipped next run

---

## Installation

### npm (recommended)

```bash
npm install -g doctrack
```

This installs the correct pre-built binary for your platform automatically.

### Build from source

```bash
cd backend
go build -o doctrack .
```

Requires Go 1.21+.

---

## Quick Start

```bash
# 1. Run the interactive setup wizard
doctrack init

# 2. Generate docs for changed files
doctrack sync

# 3. Check what has changed since the last sync
doctrack diff
```

---

## Commands

### `doctrack init`

Interactive setup wizard. Prompts for AI provider, API key, and docs directory, then writes `.doctrack.yaml` with `0600` permissions.

```bash
doctrack init
```

- Auto-detects your project type (`go`, `node`, `python`, `rust`, `java`) to pre-populate sensible `include` patterns
- Adds `.doctrack.yaml` to `.gitignore` automatically if a `.gitignore` exists
- Configures Confluence integration if requested (credentials can be filled in manually afterwards)

---

### `doctrack sync`

The main command. Scans files, generates or updates documentation for everything that has changed since the last sync.

```bash
doctrack sync [flags]
```

| Flag | Description |
|---|---|
| `--dry-run` | Show which files would be updated and estimate token usage — no API calls made |
| `--force` | Regenerate docs for all tracked files, ignoring the snapshot |
| `--confluence` | Push updated docs to Confluence after sync |
| `--no-confluence` | Skip Confluence push even if it is configured |

**Example output:**

```
Scanning... 142 tracked, 5 changed
  ● src/api/handler.go
  ○ src/config/config.go          (skipped, unchanged)
⚠ 1 secret(s) redacted in src/db/queries.go
Generating...
  ✓ docs/api/handler.md           (820 tokens)

✓ 4 doc(s) updated. ~2,350 tokens.
```

**Exit codes:**

| Code | Meaning |
|---|---|
| `0` | Success |
| `1` | Fatal error |
| `2` | Usage / bad flags |
| `3` | Config error |
| `4` | Auth error |
| `5` | Network error |
| `10` | Partial failure (some files failed) |

---

### `doctrack diff`

Shows which files have changed since the last sync, without generating any documentation.

```bash
doctrack diff [flags]
```

| Flag | Description |
|---|---|
| `--patch` | Show the full unified diff for each changed file |

**Example output:**

```
  (new)      src/api/handler.go
  (modified) src/config/loader.go
  (deleted)  src/legacy/old.go

3 file(s) changed
```

---

### `doctrack config`

Inspect and modify configuration values directly from the CLI.

#### `doctrack config list`

```bash
doctrack config list
```

Prints all active configuration values. API keys are masked (e.g. `sk-p****3fXa`).

#### `doctrack config get <key>`

```bash
doctrack config get provider
doctrack config get model
doctrack config get docs_dir
```

#### `doctrack config set <key> <value>`

```bash
doctrack config set provider anthropic
doctrack config set model claude-3-5-sonnet-20241022
doctrack config set docs_dir documentation
```

Supported keys: `provider`, `model`, `docs_dir`.

---

### `doctrack version`

```bash
doctrack version
# doctrack version 1.2.0 (commit: a1b2c3d, built: 2026-02-27T14:30:00Z)
```

---

## Global Flags

These flags work on every command:

| Flag | Description |
|---|---|
| `-q`, `--quiet` | Suppress all output except errors |
| `-v`, `--verbose` | More detailed output |
| `--debug` | Full debug output including HTTP traces |
| `--json` | Machine-readable JSON output |
| `--config <path>` | Use a specific config file instead of `.doctrack.yaml` |

---

## Configuration File

DocTrack looks for `.doctrack.yaml` in the current directory, then falls back to `~/.config/doctrack/config.yaml`.

**Full example:**

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
    api_key: "env:OPENAI_API_KEY"   # read from environment variable
    base_url: ""                     # optional: Ollama / Azure / LiteLLM endpoint
  anthropic:
    api_key: "env:ANTHROPIC_API_KEY"

# Optional Confluence integration
confluence:
  base_url: "https://yourteam.atlassian.net"
  space_key: "DOCS"
  email: "you@example.com"
  api_token: "env:CONFLUENCE_API_TOKEN"
  parent_id: "123456"               # optional: page ID to create docs under
```

### Config resolution order

CLI flag → `DOCTRACK_*` environment variable → `.doctrack.yaml` → `~/.config/doctrack/config.yaml` → built-in defaults

### API key formats

| Format | Meaning |
|---|---|
| `env:MY_VAR` | Read key from environment variable `MY_VAR` |
| `sk-...` | Literal key value (stored in config file) |
| *(empty)* | Automatically checks `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` |

> **Security:** The config file is written with `0600` permissions. DocTrack warns if it finds a broader permission mask.

---

## Generated Doc Format

Each generated Markdown file follows a structured format with YAML frontmatter and HTML comment markers. User-owned sections are **never overwritten**.

```markdown
---
doctrack:
  source: "src/api/handler.go"
  source_hash: "a1b2c3d4"
  last_sync: "2026-02-27T14:30:00Z"
  schema: 1
---

# api/handler

<!-- doctrack:user:start -->
Add your own notes here. DocTrack never touches this section.
<!-- doctrack:user:end -->

<!-- doctrack:auto:start -->
AI-generated content is placed here and updated on every sync.
<!-- doctrack:auto:end -->

<!-- doctrack:user:start -->
Additional hand-written notes section.
<!-- doctrack:user:end -->
```

- `doctrack:auto` sections are replaced on every sync
- `doctrack:user` sections are preserved exactly as written
- `source_hash` in frontmatter is compared before calling the AI — if it matches the current file hash, the file is skipped entirely

---

## Secret Detection

Before any diff is sent to the AI, DocTrack scans it for secrets and replaces them with `[REDACTED:<type>]`. Detection covers:

- AWS access keys (`AKIA...`)
- OpenAI keys (`sk-...`)
- Anthropic keys (`sk-ant-...`)
- GitHub tokens (`ghp_`, `gho_`, `ghu_`, `ghs_`, `ghr_`)
- Private key blocks (`-----BEGIN ... PRIVATE KEY-----`)
- Connection strings / DSNs
- Generic password/token assignments
- Slack and Stripe tokens

A warning is printed to stderr for each secret found. The original source file is **never modified**.

---

## `.aiignore`

Create a `.aiignore` file in your project root to prevent specific files from being tracked. Syntax follows `.gitignore` rules.

```
# .aiignore
secrets/
*.pem
*.key
internal/auth/
```

Default ignored patterns (always active):

```
.env
*.pem
*.key
**/secrets/**
**/.env*
```

---

## Confluence Integration

Push updated docs to Confluence after every sync:

```bash
doctrack sync --confluence
```

DocTrack maintains a mapping manifest at `.doctrack/confluence-manifest.yaml` that links local doc paths to Confluence page IDs. On the first push it searches for a page by title; if none exists, it creates one. Subsequent syncs update the page in place. Pages are skipped if their content hash hasn't changed.

---

## Data & Privacy

- **No server-side infrastructure.** Everything runs locally.
- **BYOK** — you supply your own AI API key. Requests go directly to OpenAI or Anthropic.
- **Diffs only** — DocTrack never sends your full source files to the AI, only unified diffs.
- **Secret redaction** happens before the diff leaves your machine.
- **No telemetry or analytics** of any kind.
