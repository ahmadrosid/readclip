package openai

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/ahmadrosid/readclip/internal/util/fetch"
)

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type OpenaiRequest struct {
	Model            string    `json:"model"`
	Messages         []Message `json:"messages"`
	Temperature      int       `json:"temperature"`
	MaxTokens        int       `json:"max_tokens"`
	TopP             int       `json:"top_p"`
	FrequencyPenalty int       `json:"frequency_penalty"`
	PresencePenalty  int       `json:"presence_penalty"`
}

type OpenaiResponse struct {
	ID      string `json:"id"`
	Object  string `json:"object"`
	Created int    `json:"created"`
	Model   string `json:"model"`
	Choices []struct {
		Index   int `json:"index"`
		Message struct {
			Role    string `json:"role"`
			Content string `json:"content"`
		} `json:"message"`
		FinishReason string `json:"finish_reason"`
	} `json:"choices"`
	Usage struct {
		PromptTokens     int `json:"prompt_tokens"`
		CompletionTokens int `json:"completion_tokens"`
		TotalTokens      int `json:"total_tokens"`
	} `json:"usage"`
}

func SummarizeContent(content string) (string, error) {
	request := OpenaiRequest{
		Model: "gpt-3.5-turbo-16k",
		Messages: []Message{
			{
				Role:    "system",
				Content: "Be concise",
			},
			{
				Role:    "system",
				Content: "Detect the language and reply with the same language.",
			},
			{
				Role:    "system",
				Content: "Summarize this article, ensuring the original meaning and context are retained. Format it into a bullet points.",
			},
			{
				Role:    "user",
				Content: content,
			},
		},
		Temperature:      1,
		TopP:             1,
		MaxTokens:        4096,
		FrequencyPenalty: 0,
		PresencePenalty:  0,
	}

	url := "https://api.openai.com/v1/chat/completions"
	Authorization := os.Getenv("OPENAI_API_KEY")
	response, err := fetch.Post(url, request, Authorization)
	if err != nil {
		return "", err
	}

	var openaiResponse OpenaiResponse
	err = json.Unmarshal([]byte(response), &openaiResponse)
	if err != nil {
		return "", err
	}

	if len(openaiResponse.Choices) == 0 {
		return "", fmt.Errorf("no reply from openai")
	}

	return openaiResponse.Choices[0].Message.Content, nil
}
