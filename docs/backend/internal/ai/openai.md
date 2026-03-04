---
doctrack:
    source: backend/internal/ai/openai.go
    source_hash: 9ea497f742f8e73697b7dde0dfd04ce124d7f738e3395e5d3f662b0cc6eea327
    last_sync: 2026-02-27T13:38:03.861979Z
    schema: 1
---
# backend/internal/ai/openai
<!-- doctrack:user:start -->
<!-- doctrack:user:end -->
<!-- doctrack:auto:start -->
### openAIProvider

The `openAIProvider` struct represents a provider for the OpenAI API. It has the following fields:

- `client`: an `openai.Client` instance for making requests to the OpenAI API
- `model`: the name of the OpenAI model to use

The `newOpenAIProvider` function creates a new `openAIProvider` instance with the specified OpenAI model, API key, and base URL (if provided).

### GenerateDocUpdate

The `GenerateDocUpdate` method of the `openAIProvider` struct calls the OpenAI chat completions API to generate a document update response. It has the following behavior:

- It uses the `retryWithBackoff` function to make the API call with exponential backoff in case of errors.
- The API call is made using the `openai.Client.Chat.Completions.New` method, passing the following parameters:
  - `model`: the OpenAI model specified in the `openAIProvider` instance
  - `Messages`: a slice containing a system message and a user message (built from the `DocUpdateRequest` parameter)
- If the API call is successful, it returns a `DocUpdateResponse` struct containing the following fields:
  - `Content`: the generated text content
  - `TokensUsed`: the number of tokens used in the generation
  - `Model`: the name of the OpenAI model used

### retryWithBackoff

The `retryWithBackoff` function is a utility function that retries a given function with exponential backoff. It has the following behavior:

- It retries the function up to a maximum of 5 attempts.
- The initial backoff delay is 500 milliseconds, and it doubles for each subsequent attempt.
- If the function returns an error that contains "401" or "403", the error is returned immediately without retrying.
- If the maximum number of attempts is reached, the final error is returned.
- The function respects the provided context, returning the context error if the context is canceled during the backoff delay.
<!-- doctrack:auto:end -->
