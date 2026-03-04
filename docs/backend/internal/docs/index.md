---
doctrack:
    source: backend/internal/docs/index.go
    source_hash: ac0158ec0faef7319f067afd3f69832835656e8819c08dfa44a058a4319fe995
    last_sync: 2026-02-27T13:37:47.691881Z
    schema: 1
---
# backend/internal/docs/index
<!-- doctrack:user:start -->
<!-- doctrack:user:end -->
<!-- doctrack:auto:start -->
## Functions

### `RegenerateIndexes(docsDir string) error`

`RegenerateIndexes` rebuilds `_index.md` files for the docs directory tree.

Parameters:
- `docsDir string`: The path to the docs directory.

Return values:
- `error`: Any errors that occurred during the regeneration process.

Key behaviors:
- Writes the root index file at `docsDir/_index.md`.
- Recursively generates index files for each subdirectory of `docsDir`.
- Includes a list of sections (subdirectories) and files in the generated index files.

### `writeRootIndex(docsDir string) error`

`writeRootIndex` generates the root index file at `docsDir/_index.md`.

Parameters:
- `docsDir string`: The path to the docs directory.

Return values:
- `error`: Any errors that occurred during the root index file generation.

Key behaviors:
- Writes a markdown file with a list of sections (subdirectories) and files in the `docsDir`.
- Sorts the sections and files alphabetically.
- Adds an auto-generated timestamp to the file.

### `writeIndex(dir string) error`

`writeIndex` generates an index file for the given directory at `dir/_index.md`.

Parameters:
- `dir string`: The path to the directory for which to generate the index file.

Return values:
- `error`: Any errors that occurred during the index file generation.

Key behaviors:
- Writes a markdown file with a list of files in the `dir` directory.
- Sorts the files alphabetically.
- Adds an auto-generated timestamp to the file.
<!-- doctrack:auto:end -->
