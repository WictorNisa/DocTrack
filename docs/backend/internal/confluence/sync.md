---
doctrack:
    source: backend/internal/confluence/sync.go
    source_hash: 26c2547bcd7d5966343714a61014d5063bd1d5d85b083d7f4adef3a446794103
    last_sync: 2026-02-27T13:37:44.680281Z
    schema: 1
---
# backend/internal/confluence/sync
<!-- doctrack:user:start -->
<!-- doctrack:user:end -->
<!-- doctrack:auto:start -->
# Syncer

The `Syncer` struct is responsible for pushing documentation to Confluence. It uses a `Client` to interact with the Confluence API and a `Manifest` to track which Confluence page each documentation file maps to.

## Methods

### `NewSyncer`

Creates a new `Syncer` instance using the provided Confluence client, space key, parent page ID, and manifest file path.

#### Parameters

- `client`: The Confluence client to use for API calls.
- `spaceKey`: The Confluence space key where the documentation will be uploaded.
- `parentID`: The ID of the parent Confluence page under which the documentation will be created.
- `manifestPath`: The file path to the manifest file that tracks the mapping between documentation files and Confluence pages.

#### Return Value

- A new `Syncer` instance, or an error if the manifest file could not be loaded.

### `SyncFile`

Pushes the documentation file at the given `docPath` to Confluence, creating a new page or updating an existing one as needed.

#### Parameters

- `ctx`: The context for the operation.
- `docPath`: The file path of the documentation to be synced.
- `title`: The title to be used for the Confluence page.

#### Return Value

- An error if the operation failed, or `nil` if the file was successfully synced.

### `loadManifest`

Loads the manifest file from the specified `path` and returns a `Manifest` instance.

#### Parameters

- `path`: The file path to the manifest file.

#### Return Value

- A `Manifest` instance, or an error if the file could not be read or parsed.

### `saveManifest`

Saves the current `Manifest` instance to the specified manifest file path.

#### Return Value

- An error if the manifest file could not be written.
<!-- doctrack:auto:end -->
