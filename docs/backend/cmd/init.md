---
doctrack:
    source: backend/cmd/init.go
    source_hash: 0383dbb0fa03994eae2dd2831852acecdbea365c29db12fb4bcabfb8269b5ef7
    last_sync: 2026-02-27T13:37:57.255234Z
    schema: 1
---
# backend/cmd/init
<!-- doctrack:user:start -->
<!-- doctrack:user:end -->
<!-- doctrack:auto:start -->
# `init` Command

The `init` command is an interactive setup wizard for the DocTrack tool. It helps you configure the necessary settings to start using DocTrack in your project.

The command performs the following tasks:

1. Detects the project type (Go, Node.js, Python, Rust, Java, or generic) based on the presence of specific project files in the current directory.
2. Prompts the user to select an AI provider (OpenAI or Anthropic), enter the API key, and specify the documentation directory.
3. Allows the user to configure the Confluence integration (the credentials need to be added manually to the configuration file later).
4. Generates a default configuration file (`.doctrack.yaml`) based on the user's input, including the project type, AI provider, documentation directory, and other settings.
5. Adds the generated configuration file to the `.gitignore` file to prevent the API key from being committed to the repository.
6. Provides instructions to run `doctrack sync` to generate the documentation.

The configuration file contains the following settings:

- `Version`: The version of the configuration format.
- `Provider`: The selected AI provider (either "openai" or "anthropic").
- `Model`: The default model for the selected AI provider.
- `DocsDir`: The documentation directory.
- `Mapping`: The documentation mapping mode (currently fixed to "mirror").
- `Include`: The file patterns to include for documentation generation.
- `Exclude`: The file patterns to exclude from documentation generation.
- `Providers.OpenAI.APIKey`: The API key for the OpenAI provider (if selected).
- `Providers.Anthropic.APIKey`: The API key for the Anthropic provider (if selected).
- `Confluence`: The Confluence integration configuration (if enabled).

The `defaultIncludes` function determines the default file patterns to include for documentation generation based on the detected project type.

The `addToGitignore` function adds the generated configuration file to the `.gitignore` file to prevent the API key from being committed to the repository.
<!-- doctrack:auto:end -->
