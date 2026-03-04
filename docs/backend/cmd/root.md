---
doctrack:
    source: backend/cmd/root.go
    source_hash: 38ad106757845fb3bdf8ed107203dac799ee692c7a35ca1d2a0a2263722487c2
    last_sync: 2026-02-27T13:38:00.123875Z
    schema: 1
---
# backend/cmd/root
<!-- doctrack:user:start -->
<!-- doctrack:user:end -->
<!-- doctrack:auto:start -->
## API

### `SetBuildInfo(version, commit, date string)`
- Sets the build version, commit, and date metadata.

### `Execute()`
- Entry point called from `main()`.
- Executes the root command.

### `initLogger()`
- Initializes the package-level structured logger based on the parsed global flags.

### `resolveLogLevel() log.Level`
- Resolves the appropriate log level based on the parsed global flags.

### `contextKeyConfig`
- Context key used to store the loaded `Config` instance.
<!-- doctrack:auto:end -->
