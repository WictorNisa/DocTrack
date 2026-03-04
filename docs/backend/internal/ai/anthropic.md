---
doctrack:
    source: backend/internal/ai/anthropic.go
    source_hash: 6404b7e023055193570d1b1ad6486937752bcd46072cce81d443613bd64f4d45
    last_sync: 2026-02-27T13:38:00.994737Z
    schema: 1
---
# backend/internal/ai/anthropic
<!-- doctrack:user:start -->
<!-- doctrack:user:end -->
<!-- doctrack:auto:start -->
## Documentation Update

### `GenerateDocUpdate`

Calls the Anthropic messages API with retry logic to generate a document update response.

#### Parameters

- `ctx context.Context`: The context for the request.
- `req DocUpdateRequest`: The request for the document update.

#### Return Values

- `*DocUpdateResponse`: The response containing the generated content, token count, and model used.
- `error`: Any error that occurred during the request.

The function retries the Anthropic API call up to 5 times with exponential backoff, handling 401 and 403 errors differently. It returns the response if the call is successful, or the last encountered error if the maximum number of attempts is reached.

### `anthropicUserMessage`

Constructs an Anthropic `MessageParam` for a user message with the given text.

#### Parameters

- `text string`: The text of the user message.

#### Return Values

- `anthropic.MessageParam`: The constructed user message parameter.

### `retryAnthropicWithBackoff`

Retries a function call with exponential backoff up to a maximum number of attempts.

#### Parameters

- `ctx context.Context`: The context for the retries.
- `fn func() error`: The function to call and retry.

#### Return Values

- `error`: Any error that occurred after the maximum number of attempts.

The function retries the provided function call up to 5 times, with the delay between attempts doubling after each failed attempt. It returns the last encountered error if the maximum number of attempts is reached, or the context is canceled.
<!-- doctrack:auto:end -->
