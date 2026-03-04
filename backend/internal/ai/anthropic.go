package ai

import (
	"context"
	"fmt"

	anthropic "github.com/anthropics/anthropic-sdk-go"
	"github.com/anthropics/anthropic-sdk-go/option"
)

type anthropicProvider struct {
	client anthropic.Client
	model  string
}

func newAnthropicProvider(model, apiKey, baseURL string) *anthropicProvider {
	opts := []option.RequestOption{option.WithAPIKey(apiKey)}
	if baseURL != "" {
		opts = append(opts, option.WithBaseURL(baseURL))
	}
	return &anthropicProvider{
		client: anthropic.NewClient(opts...),
		model:  model,
	}
}

// GenerateDocUpdate calls the Anthropic messages API with retry logic.
func (p *anthropicProvider) GenerateDocUpdate(ctx context.Context, req DocUpdateRequest) (*DocUpdateResponse, error) {
	var msg *anthropic.Message
	err := retryWithBackoff(ctx, func() error {
		var callErr error
		msg, callErr = p.client.Messages.New(ctx, anthropic.MessageNewParams{
			Model:     anthropic.Model(p.model),
			MaxTokens: 4096,
			System: []anthropic.TextBlockParam{
				{Text: systemPrompt},
			},
			Messages: []anthropic.MessageParam{
				anthropicUserMessage(buildUserPrompt(req)),
			},
		})
		return callErr
	})
	if err != nil {
		return nil, fmt.Errorf("anthropic messages: %w", err)
	}
	var content string
	for _, block := range msg.Content {
		if block.Type == "text" {
			content += block.Text
		}
	}
	tokenCount := int(msg.Usage.InputTokens + msg.Usage.OutputTokens)
	return &DocUpdateResponse{
		Content:    content,
		TokensUsed: tokenCount,
		Model:      string(msg.Model),
	}, nil
}

func anthropicUserMessage(text string) anthropic.MessageParam {
	return anthropic.NewUserMessage(anthropic.NewTextBlock(text))
}
