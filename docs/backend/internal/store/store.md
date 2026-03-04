---
doctrack:
    source: backend/internal/store/store.go
    source_hash: e66c4399d1fdb41b0b53c3f3c3416da01a4a383e8c76b8842208e0b63e24d47e
    last_sync: 2026-02-27T13:37:53.520191Z
    schema: 1
---
# backend/internal/store/store
<!-- doctrack:user:start -->
<!-- doctrack:user:end -->
<!-- doctrack:auto:start -->
# Auto-generated Documentation

## `Snapshot`

`Snapshot` records the state of all tracked files at a point in time.

### Fields

- `Timestamp`: the time the snapshot was taken
- `Files`: a map of file paths to `FileEntry` records

## `FileEntry`

`FileEntry` holds metadata for a single tracked file.

### Fields

- `Hash`: the hash of the file contents
- `ModTime`: the modification time of the file
- `Size`: the size of the file in bytes

## Functions

### `EmptySnapshot()`

`EmptySnapshot()` returns a zeroed `Snapshot` with an initialized `Files` map.

### `LoadSnapshot(path string)`

`LoadSnapshot(path string)` reads a JSON-encoded `Snapshot` from the specified file path.

#### Parameters

- `path` (string): the file path to load the snapshot from

#### Return Values

1. `*Snapshot`: the loaded snapshot, or `nil` if an error occurred
2. `error`: any error that occurred while loading the snapshot

### `SaveSnapshot(path string, snap *Snapshot)`

`SaveSnapshot(path string, snap *Snapshot)` writes the provided `Snapshot` to the specified file path as a JSON-encoded document. It creates any necessary parent directories.

#### Parameters

- `path` (string): the file path to save the snapshot to
- `snap` (`*Snapshot`): the snapshot to save

#### Return Values

1. `error`: any error that occurred while saving the snapshot
<!-- doctrack:auto:end -->
