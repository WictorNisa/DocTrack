package ai

import (
	"context"
	"errors"
	"fmt"

	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
)

type openAIProvider struct {
	client openai.Client
	model  string
}

func newOpenAIProvider(model, apiKey, baseURL string) *openAIProvider {
	opts := []option.RequestOption{option.WithAPIKey(apiKey)}
	if baseURL != "" {
		opts = append(opts, option.WithBaseURL(baseURL))
	}
	return &openAIProvider{
		client: openai.NewClient(opts...),
		model:  model,
	}
}

// GenerateDocUpdate calls the OpenAI chat completions API with retry logic.
func (p *openAIProvider) GenerateDocUpdate(ctx context.Context, req DocUpdateRequest) (*DocUpdateResponse, error) {
	var resp *openai.ChatCompletion
	err := retryWithBackoff(ctx, func() error {
		var callErr error
		resp, callErr = p.client.Chat.Completions.New(ctx, openai.ChatCompletionNewParams{
			Model: openai.ChatModel(p.model),
			Messages: []openai.ChatCompletionMessageParamUnion{
				openai.SystemMessage(systemPrompt),
				openai.UserMessage(buildUserPrompt(req)),
			},
		})
		return callErr
	})
	if err != nil {
		return nil, fmt.Errorf("openai completions: %w", err)
	}
	if len(resp.Choices) == 0 {
		return nil, errors.New("openai: no choices returned")
	}
	return &DocUpdateResponse{
		Content:    resp.Choices[0].Message.Content,
		TokensUsed: int(resp.Usage.TotalTokens),
		Model:      resp.Model,
	}, nil
}
