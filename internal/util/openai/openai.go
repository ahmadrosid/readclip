package openai

import (
	"encoding/json"
	"fmt"

	"strings"

	"github.com/ahmadrosid/readclip/internal/util/env"
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

func TrimText(content string, length int) string {
	lengthContent := strings.Count(content, " ")
	trimmedContent := content
	if lengthContent > length {
		splits := strings.Split(content, " ")
		trimmedContent = strings.Join(splits[0:length], " ")
	}
	return trimmedContent
}

func SummarizeContent(content string) (string, error) {
	trimmedContent := TrimText(content, 2500)

	request := OpenaiRequest{
		Model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
		Messages: []Message{
			{
				Role:    "system",
				Content: "Be concise. Detect the language and reply with the same language.",
			},
			{
				Role:    "user",
				Content: trimmedContent + "\n\nSummarize this article, ensuring the original meaning and context are retained. Format it into a bullet points.",
			},
		},
		Temperature:      1,
		TopP:             1,
		MaxTokens:        4096,
		FrequencyPenalty: 0,
		PresencePenalty:  0,
	}

	// url := "https://api.openai.com/v1/chat/completions"
	// url := "http://143.198.16.88:3040/v1/chat/completions"
	// Authorization := env.GetEnv("OPENAI_API_KEY")

	url := "https://api.together.xyz/v1/chat/completions"
	Authorization := env.GetEnv("TOGETHER_API_KEY")
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

func AnalyzeContentForTags(content string, existingTags []string) ([]string, error) {
	trimmedContent := TrimText(content, 2500)

	existingTagsContext := strings.Join(existingTags, ", ")
	prompt := trimmedContent + "\nAnalyze these text. I want you to choose a tags to describe this content. Here the tags options for you to use: " + existingTagsContext + "\n Only give me the tag from the options nothing else."
	request := OpenaiRequest{
		Model: "gpt-3.5-turbo-16k",
		Messages: []Message{
			{
				Role:    "user",
				Content: prompt,
			},
		},
		Temperature:      0,
		TopP:             1,
		MaxTokens:        100,
		FrequencyPenalty: 0,
		PresencePenalty:  0,
	}

	url := "http://143.198.16.88:3040/v1/chat/completions"
	// url := "http://localhost:3040/v1/chat/completions"
	// url := "https://api.openai.com/v1/chat/completions"
	Authorization := env.GetEnv("OPENAI_API_KEY")
	response, err := fetch.Post(url, request, Authorization)
	if err != nil {
		return nil, err
	}

	var openaiResponse OpenaiResponse
	err = json.Unmarshal([]byte(response), &openaiResponse)
	if err != nil {
		return nil, err
	}

	if len(openaiResponse.Choices) == 0 {
		return nil, fmt.Errorf("no reply from openai")
	}

	tags := strings.Split(openaiResponse.Choices[0].Message.Content, ",")
	for i, tag := range tags {
		tags[i] = strings.TrimSpace(tag)
	}

	return tags, nil
}
