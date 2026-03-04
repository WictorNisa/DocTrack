---
doctrack:
    source: backend/internal/ai/prompt.go
    source_hash: b7efc42371d342b311eb4e291fb75a5b788bc10a4df59b27e6835e9e1f13ef7e
    last_sync: 2026-02-27T13:37:58.842618Z
    schema: 1
---
# backend/internal/ai/prompt
<!-- doctrack:user:start -->
<!-- doctrack:user:end -->
<!-- doctrack:auto:start -->
## Auto-Generated Documentation

The `buildUserPrompt` function assembles the user prompt sent to the AI. It takes a `DocUpdateRequest` struct as input and returns a string containing the prompt. The prompt includes the file path, the programming language, the existing documentation (if provided), and the source code diff.

The `LanguageFromPath` function returns a human-readable language name derived from the file extension. It supports various common programming languages and extensions, and falls back to "text" if the extension is not recognized.
<!-- doctrack:auto:end -->
