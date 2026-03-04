---
doctrack:
    source: backend/internal/differ/differ.go
    source_hash: 1ea2cc5313848a9d7debb48e2a854d561b9c38df245cf0316858e164a32acb16
    last_sync: 2026-02-27T13:37:53.520735Z
    schema: 1
---
# backend/internal/differ/differ
<!-- doctrack:user:start -->
<!-- doctrack:user:end -->
<!-- doctrack:auto:start -->
## Package `differ`

The `differ` package computes unified diffs for changed source files.

### `Compute(root string, f tracker.ChangedFile) (string, error)`

Computes a unified diff for the changed file `f`.

Parameters:
- `root`: The root directory of the repository.
- `f`: The changed file to compute the diff for.

Returns:
- The unified diff as a string, or an error if the diff could not be computed.

If the file has been deleted, the function returns a diff that shows the file as deleted. If the repository is a Git repository, the function uses `git diff` to compute the diff. Otherwise, it computes the diff by comparing the new file content to the previous content stored in the `.doctrack/blobs` directory.

### `isGitRepo(root string) bool`

Checks if the directory at `root` is a Git repository.

Parameters:
- `root`: The directory to check.

Returns:
- `true` if the directory is a Git repository, `false` otherwise.

The function runs `git rev-parse --git-dir` and checks if the command succeeds.

### `gitDiff(root string, f tracker.ChangedFile) (string, error)`

Computes a unified diff using `git diff` for the changed file `f`.

Parameters:
- `root`: The root directory of the repository.
- `f`: The changed file to compute the diff for.

Returns:
- The unified diff as a string, or an error if the diff could not be computed.

If the file has been added, the function generates a diff that shows the file as a new file. Otherwise, it runs `git diff HEAD -- <file>` to compute the diff.

### `newFileDiff(path string) (string, error)`

Generates a unified diff for a new file.

Parameters:
- `path`: The path to the new file.

Returns:
- The unified diff as a string, or an error if the diff could not be generated.

The function reads the contents of the file, splits it into lines, and generates a unified diff that shows the file as a new file.

### `blobDiff(root string, f tracker.ChangedFile) (string, error)`

Computes a unified diff by comparing the new file content to the previous content stored in the `.doctrack/blobs` directory.

Parameters:
- `root`: The root directory of the repository.
- `f`: The changed file to compute the diff for.

Returns:
- The unified diff as a string, or an error if the diff could not be computed.

The function first creates the `.doctrack/blobs` directory if it doesn't exist. It then reads the new file content and the previous file content (if available) from the blobs directory. Finally, it uses the `diffmatchpatch` library to compute the unified diff.

### `patchToUnified(name, oldText string, diffs []diffmatchpatch.Diff, dmp *diffmatchpatch.DiffMatchPatch) string`

Converts a set of patches to a unified diff.

Parameters:
- `name`: The name of the file.
- `oldText`: The original content of the file.
- `diffs`: The set of diffs between the original and new content.
- `dmp`: The `diffmatchpatch` instance used to compute the diffs.

Returns:
- The unified diff as a string.

The function uses the `diffmatchpatch` library to generate a set of patches from the diffs, and then formats the patches into a unified diff.
<!-- doctrack:auto:end -->
