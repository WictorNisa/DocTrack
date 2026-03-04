// Package ai provides a unified interface to AI providers.
package ai

import (
	"context"
	"fmt"
	"math"
	"net/http"
	"time"
)

// DocUpdateRequest contains everything the AI needs to generate or update a doc.
type DocUpdateRequest struct {
	FilePath    string
	Diff        string
	ExistingDoc string
	Language    string
}

// DocUpdateResponse holds the AI-generated documentation content.
type DocUpdateResponse struct {
	Content    string
	TokensUsed int
	Model      string
}

// Provider is the interface implemented by each AI backend.
type Provider interface {
	GenerateDocUpdate(ctx context.Context, req DocUpdateRequest) (*DocUpdateResponse, error)
}

// NewProvider returns the correct Provider for the given provider name.
func NewProvider(providerName, model, apiKey, baseURL string) (Provider, error) {
	if apiKey == "" {
		return nil, fmt.Errorf("API key is required for provider %q", providerName)
	}
	switch providerName {
	case "openai":
		return newOpenAIProvider(model, apiKey, baseURL), nil
	case "anthropic":
		return newAnthropicProvider(model, apiKey, baseURL), nil
	default:
		return nil, fmt.Errorf("unknown provider %q: use \"openai\" or \"anthropic\"", providerName)
	}
}

// retryWithBackoff retries fn with exponential backoff. Non-retryable auth errors
// (401/403) are returned immediately.
func retryWithBackoff(ctx context.Context, fn func() error) error {
	const maxAttempts = 5
	base := 500 * time.Millisecond
	for attempt := range maxAttempts {
		err := fn()
		if err == nil {
			return nil
		}
		if sc := apiErrorStatusCode(err); sc == http.StatusUnauthorized || sc == http.StatusForbidden {
			return err
		}
		if attempt == maxAttempts-1 {
			return err
		}
		wait := time.Duration(math.Pow(2, float64(attempt))) * base
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-time.After(wait):
		}
	}
	return nil
}

// apiErrorStatusCode extracts the HTTP status code from an SDK API error.
// Returns 0 if err is not a recognised API error type.
func apiErrorStatusCode(err error) int {
	type hasStatus interface{ StatusCode() int }
	for e := err; e != nil; {
		if sc, ok := e.(hasStatus); ok {
			return sc.StatusCode()
		}
		u, ok := e.(interface{ Unwrap() error })
		if !ok {
			break
		}
		e = u.Unwrap()
	}
	return 0
}
