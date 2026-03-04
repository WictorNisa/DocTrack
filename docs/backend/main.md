---
doctrack:
    source: backend/main.go
    source_hash: c52c9e5561d7143bc257f0c78ff98dc7d5b0042b195d630b17ecbfd575102615
    last_sync: 2026-02-27T13:37:57.859238Z
    schema: 1
---
# backend/main
<!-- doctrack:user:start -->
<!-- doctrack:user:end -->
<!-- doctrack:auto:start -->
## Public API

The `main` package provides the entry point for the DocTrack application. It imports the `cmd` package from the `github.com/wictorn/doctrack/cmd` repository.

The `main` function sets the build information (version, commit, and date) using the `cmd.SetBuildInfo` function, and then calls `cmd.Execute()` to start the application.

## Parameters

The `main` function takes no parameters.

## Return Values

The `main` function does not return any values.

## Key Behaviors

1. The `main` function sets the build information (version, commit, and date) for the DocTrack application.
2. The `main` function calls `cmd.Execute()` to start the DocTrack application.
<!-- doctrack:auto:end -->
