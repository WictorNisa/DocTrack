---
doctrack:
    source: backend/internal/ai/provider.go
    source_hash: c72e09a24e6f07571c78880c80c80bc6c18b93e9991b3df5fe09307602d958be
    last_sync: 2026-02-27T13:37:57.504737Z
    schema: 1
---
# backend/internal/ai/provider
<!-- doctrack:user:start -->
<!-- doctrack:user:end -->
<!-- doctrack:auto:start -->
## Provider

The `Provider` interface defines the contract for AI providers that can generate or update documentation.

### `GenerateDocUpdate(ctx context.Context, req DocUpdateRequest) (*DocUpdateResponse, error)`

Generates a documentation update based on the provided `DocUpdateRequest`.

#### Parameters

- `ctx`: The context for the request.
- `req`: A `DocUpdateRequest` containing the necessary information to generate the documentation update, including the file path, diff, existing documentation, and language.

#### Return Value

- `*DocUpdateResponse`: A pointer to a `DocUpdateResponse` struct containing the generated documentation content, the number of tokens used, and the model used.
- `error`: Any error that occurred during the documentation generation process.

## `DocUpdateRequest`

Represents the information needed by an AI provider to generate or update documentation.

- `FilePath`: The file path of the code being documented.
- `Diff`: The code diff for which the documentation needs to be updated.
- `ExistingDoc`: The existing documentation for the code.
- `Language`: The programming language of the code.

## `DocUpdateResponse`

Represents the output of an AI provider's documentation generation or update.

- `Content`: The generated or updated documentation content.
- `TokensUsed`: The number of tokens used by the AI model to generate the documentation.
- `Model`: The AI model used to generate the documentation.

## `NewProvider(providerName, model, apiKey, baseURL string) (Provider, error)`

Creates a new `Provider` instance based on the specified provider name, model, API key, and base URL.

- `providerName`: The name of the AI provider, either "openai" or "anthropic".
- `model`: The name of the AI model to use.
- `apiKey`: The API key for the AI provider.
- `baseURL`: The base URL for the AI provider's API (optional, only for OpenAI).

The function returns a `Provider` instance and an error. If the provider name is unknown, an error is returned.
<!-- doctrack:auto:end -->
