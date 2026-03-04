---
doctrack:
    source: backend/cmd/version.go
    source_hash: aef894841871a65a408948bd25541e5b1977ee7f83448bda7252bc89759945fd
    last_sync: 2026-02-27T13:37:54.620426Z
    schema: 1
---
# backend/cmd/version
<!-- doctrack:user:start -->
<!-- doctrack:user:end -->
<!-- doctrack:auto:start -->
## Version Command

The `version` command prints the current version information of the DocTrack application, including the version number, Git commit hash, and build date.

The command is registered as a subcommand of the root command, so it can be accessed by running `doctrack version`.

When the `version` command is executed, it calls the `runVersion` function, which formats and prints the version information to the console.
<!-- doctrack:auto:end -->
