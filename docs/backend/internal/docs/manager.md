---
doctrack:
    source: backend/internal/docs/manager.go
    source_hash: cdde36cb2b583e3b482f266e6aedc2a43d755ffa5df152f8999c63781c170ff7
    last_sync: 2026-02-27T13:37:45.632816Z
    schema: 1
---
# backend/internal/docs/manager
<!-- doctrack:user:start -->
<!-- doctrack:user:end -->
<!-- doctrack:auto:start -->
## Manager

The `Manager` type handles reading and writing documentation files.

### NewManager

```go
func NewManager(docsDir string) *Manager
```

`NewManager` returns a `Manager` rooted at the specified `docsDir`.

### NewDocFile

```go
func NewDocFile(sourcePath, sourceHash string) *DocFile
```

`NewDocFile` creates a fresh `DocFile` for a new source file. It initializes the `Frontmatter.Doctrack` fields with the provided `sourcePath` and `sourceHash`, and sets the `Title` based on the source file path.

### IsStale

```go
func IsStale(df *DocFile, currentHash string) bool
```

`IsStale` returns `true` if the doc's `source_hash` differs from the provided `currentHash`.

### Read

```go
func (m *Manager) Read(path string) (*DocFile, error)
```

`Read` parses a documentation file at the specified `path` and returns a `DocFile` instance.

### Write

```go
func (m *Manager) Write(path string, df *DocFile) error
```

`Write` serializes the provided `DocFile` and writes it to the specified `path`. It updates the `Frontmatter.Doctrack.LastSync` field to the current time.
<!-- doctrack:auto:end -->
