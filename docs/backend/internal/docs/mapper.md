---
doctrack:
    source: backend/internal/docs/mapper.go
    source_hash: 6504bb4672f740bd06ea722da1a118711a82296830a9682bbe76a15db392459e
    last_sync: 2026-02-27T13:37:47.461326Z
    schema: 1
---
# backend/internal/docs/mapper
<!-- doctrack:user:start -->
<!-- doctrack:user:end -->
<!-- doctrack:auto:start -->
### Mapper

`Mapper` translates source file paths to documentation file paths.

#### NewMapper

```go
func NewMapper(docsDir string) *Mapper
```

`NewMapper` returns a `Mapper` rooted at `docsDir`.

#### SourceToDocPath

```go
func (m *Mapper) SourceToDocPath(sourcePath string) string
```

`SourceToDocPath` converts a relative source path to the corresponding doc path.

Example: `src/api/handler.go` -> `docs/api/handler.md`

#### DocToSourcePath

```go
func (m *Mapper) DocToSourcePath(docPath string) string
```

`DocToSourcePath` is the reverse of `SourceToDocPath` (best-effort).
<!-- doctrack:auto:end -->
