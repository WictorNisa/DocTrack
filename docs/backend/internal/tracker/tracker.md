---
doctrack:
    source: backend/internal/tracker/tracker.go
    source_hash: db212c1d00f01df8c5dc71fe5319d1659a529b135fa4fc2bafbc28967245e537
    last_sync: 2026-02-27T13:37:53.520833Z
    schema: 1
---
# backend/internal/tracker/tracker
<!-- doctrack:user:start -->
<!-- doctrack:user:end -->
<!-- doctrack:auto:start -->
## Package tracker

The `tracker` package detects which source files have changed since the last sync.

### Functions

#### `Scan(root string, cfg *config.Config) (*store.Snapshot, error)`

Scans the project rooted at `root` and returns the current snapshot.

- Parameters:
  - `root`: the root directory of the project
  - `cfg`: the configuration for the project
- Returns:
  - a `store.Snapshot` representing the current state of the project
  - an error, if any

#### `Diff(old, new *store.Snapshot) []ChangedFile`

Returns the files that changed between the `old` and `new` snapshots.

- Parameters:
  - `old`: the previous snapshot
  - `new`: the current snapshot
- Returns:
  - a slice of `ChangedFile` objects representing the changes

#### `AllFiles(snap *store.Snapshot) []ChangedFile`

Returns every file in the `snap` snapshot as a `ChangedFile` (for use with the `--force` option).

- Parameters:
  - `snap`: the snapshot to get all files from
- Returns:
  - a slice of `ChangedFile` objects representing all files in the snapshot

#### `listFiles(root string, cfg *config.Config, aiIgnore []string) ([]string, error)`

Returns all tracked file paths, using `git ls-files` when available.

- Parameters:
  - `root`: the root directory of the project
  - `cfg`: the configuration for the project
  - `aiIgnore`: a list of patterns to ignore
- Returns:
  - a slice of file paths
  - an error, if any

#### `hashFiles(root string, paths []string) (map[string]store.FileEntry, error)`

Computes the SHA-256 hash for each file path using a bounded worker pool.

- Parameters:
  - `root`: the root directory of the project
  - `paths`: the file paths to hash
- Returns:
  - a map of file paths to `store.FileEntry` objects representing the file metadata
  - an error, if any

#### `hashFile(path string) (store.FileEntry, error)`

Hashes a single file by streaming through SHA-256 (without fully reading the file).

- Parameters:
  - `path`: the path to the file to hash
- Returns:
  - a `store.FileEntry` object representing the file metadata
  - an error, if any

#### `matchesPatterns(path string, patterns []string) bool`

Returns true if the `path` matches any of the glob `patterns`.

- Parameters:
  - `path`: the file path to check
  - `patterns`: the glob patterns to match against
- Returns:
  - a boolean indicating whether the path matches any of the patterns

#### `loadAIIgnore(root string) []string`

Reads the `.aiignore` file and returns the patterns. Returns default patterns if the `.aiignore` file is missing.

- Parameters:
  - `root`: the root directory of the project
- Returns:
  - a slice of ignore patterns
<!-- doctrack:auto:end -->
