---
doctrack:
    source: backend/cmd/diff.go
    source_hash: 5039295d06121554d0a33df1d99191f2e8016cdf3fa5f7e39033c4df73db474e
    last_sync: 2026-02-27T13:37:42.918024Z
    schema: 1
---
# backend/cmd/diff
<!-- doctrack:user:start -->
<!-- doctrack:user:end -->
<!-- doctrack:auto:start -->
## `diffCmd`

The `diffCmd` is a Cobra command that shows the files changed since the last sync. It has the following features:

- **Use:** `diff`
- **Short:** "Show files changed since last sync"
- **Flags:**
  - `patch`: Show full unified diff

The `runDiff` function implements the command's logic:

1. Loads the existing file snapshot from `.doctrack/snapshot.json`.
2. Scans the current directory and its subdirectories to create a new file snapshot.
3. Computes the diff between the old and new snapshots.
4. Prints the changed files with color-coded labels (added, modified, deleted).
5. If the `patch` flag is set, it also prints the full unified diff for each changed file.
6. Finally, it prints the total number of changed files.

The function returns an error if there is an issue scanning the files or loading the existing snapshot.
<!-- doctrack:auto:end -->
