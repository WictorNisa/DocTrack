---
doctrack:
    source: backend/cmd/sync.go
    source_hash: 7e5dc940c887d6e6f3dc4b01414ab0d3bec1af62a79be1a14b7c9010024bae66
    last_sync: 2026-02-27T13:38:03.861893Z
    schema: 1
---
# backend/cmd/sync
<!-- doctrack:user:start -->
<!-- doctrack:user:end -->
<!-- doctrack:auto:start -->
## Auto-generated Documentation Updates

This code is responsible for synchronizing documentation with changes in the source code. The main functionality is as follows:

### Scanning and Diffing

- The code scans the source code directory (`.`) to create a new snapshot of the files.
- It then compares the new snapshot with the previously saved snapshot to determine which files have changed.
- If the `--force` flag is set, the code will regenerate documentation for all files, not just the changed ones.

### Generating Documentation Updates

- For each changed file, the code computes the diff between the old and new versions.
- It then scans the diff for any potential secret information and redacts it.
- The redacted diff is passed to an AI provider, which generates an updated documentation section for the file.
- The updated documentation is written back to the corresponding documentation file.

### Saving and Reporting

- After all files have been processed, the code saves the new snapshot to disk.
- It then reports the number of files updated and the estimated number of tokens used by the AI provider.
- If any errors occurred during the process, the program will exit with a non-zero status code.

### Flags

The command supports the following flags:

- `--dry-run`: Shows what would be updated without actually calling the AI provider.
- `--confluence`: Pushes the updated documentation to Confluence after the sync.
- `--no-confluence`: Skips the Confluence push, even if it is configured.
- `--force`: Regenerates all documentation, not just the changed files.
<!-- doctrack:auto:end -->
