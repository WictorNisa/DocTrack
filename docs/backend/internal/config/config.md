---
doctrack:
    source: backend/internal/config/config.go
    source_hash: 587277e5f3e58ccc43a64363177d93ff34bda57ed0ba9905dbd57bfa1ff8bdf9
    last_sync: 2026-02-27T13:37:50.03811Z
    schema: 1
---
# backend/internal/config/config
<!-- doctrack:user:start -->
<!-- doctrack:user:end -->
<!-- doctrack:auto:start -->
## Config

The `Config` struct represents the top-level DocTrack configuration. It has the following fields:

- `Version`: The configuration schema version.
- `Provider`: The AI provider to use, defaults to "openai".
- `Model`: The AI model to use.
- `DocsDir`: The directory where the documentation files are located, defaults to "docs".
- `Mapping`: The mapping strategy for the documentation, defaults to "mirror".
- `Include`: A list of glob patterns to include in the documentation generation.
- `Exclude`: A list of glob patterns to exclude from the documentation generation.
- `Providers`: Provider-specific configurations, including API keys and base URLs.
- `Confluence`: Configuration for the Confluence integration, including the base URL, space key, email, API token, and optional parent page ID.

## ProvidersConfig

The `ProvidersConfig` struct holds the per-provider settings, including:

- `OpenAI`: Configuration for the OpenAI provider.
- `Anthropic`: Configuration for the Anthropic provider.

## ProviderConfig

The `ProviderConfig` struct holds the settings for a single AI provider, including:

- `APIKey`: The API key for the provider.
- `BaseURL`: The base URL for the provider's API.
- `Model`: The AI model to use.

## ConfluenceConfig

The `ConfluenceConfig` struct holds the Confluence integration settings, including:

- `BaseURL`: The base URL for the Confluence instance.
- `SpaceKey`: The Confluence space key.
- `Email`: The email address used for authentication.
- `APIToken`: The API token used for authentication.
- `ParentID`: The optional parent page ID for the generated documentation.

## Load

The `Load` function reads the configuration from the given path (or discovers it) and applies environment variable overrides.

## Write

The `Write` function serializes the configuration to the specified path with 0600 permissions.

## CheckPermissions

The `CheckPermissions` function warns if the configuration file containing secrets is world-readable.

## ActiveProviderConfig

The `ActiveProviderConfig` method returns the `ProviderConfig` for the active provider.
<!-- doctrack:auto:end -->
