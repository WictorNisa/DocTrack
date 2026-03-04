---
doctrack:
    source: backend/cmd/config.go
    source_hash: a11e1032623e33f0d8d6698cb1aac6dce7857665740c5a63ea7c88e113add631
    last_sync: 2026-02-27T13:37:56.340191Z
    schema: 1
---
# backend/cmd/config
<!-- doctrack:user:start -->
<!-- doctrack:user:end -->
<!-- doctrack:auto:start -->
## Command: `config`

The `config` command provides a way to manage the DocTrack configuration.

### Subcommands

#### `get <key>`

Gets the value of the specified configuration `key`.

#### `set <key> <value>`

Sets the value of the specified configuration `key` to `value`.

#### `list`

Lists all the configuration values, masking any sensitive API keys.

### Configuration Fields

- `provider`: The provider to use for the DocTrack service.
- `model`: The model to use for the DocTrack service.
- `docs_dir`: The directory where the documentation files are located.
- `mapping`: The mapping configuration for the DocTrack service.
- `providers.openai.api_key`: The API key for the OpenAI provider.
- `providers.anthropic.api_key`: The API key for the Anthropic provider.
<!-- doctrack:auto:end -->
