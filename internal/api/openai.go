package api

import (
	"bufio"
	"fmt"
	"io"
	"os"

	"github.com/gofiber/fiber/v2"
	openai "github.com/sashabaranov/go-openai"
)

type openaiHandler struct{}

func NewOpenAIHandler(route fiber.Router) {
	handler := &openaiHandler{}
	route.Post("/anyscale", handler.createCompletion)
}

func (h *openaiHandler) createCompletion(c *fiber.Ctx) error {
	ctx := c.Context()

	anyscaleAPIKey := os.Getenv("ANYSCALE_API_KEY")
	if anyscaleAPIKey == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "ANYSCALE_API_KEY environment variable is not set",
		})
	}

	cfg := openai.DefaultConfig(anyscaleAPIKey)
	cfg.BaseURL = "https://api.endpoints.anyscale.com/v1"
	client := openai.NewClientWithConfig(cfg)

	req := new(openai.ChatCompletionRequest)
	if err := c.BodyParser(req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	req.Stream = true

	c.Context().SetContentType("text/event-stream")
	c.Context().Response.Header.Set("Cache-Control", "no-cache")
	c.Context().Response.Header.Set("Connection", "keep-alive")
	c.Context().Response.Header.Set("Transfer-Encoding", "chunked")
	c.Context().Response.Header.Set("Access-Control-Allow-Origin", "*")
	c.Context().Response.Header.Set("Access-Control-Allow-Headers", "Cache-Control")
	c.Context().Response.Header.Set("Access-Control-Allow-Credentials", "true")

	stream, err := client.CreateChatCompletionStream(c.Context(), *req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	defer stream.Close()

	writer := bufio.NewWriter(ctx.Response.BodyWriter())
	defer writer.Flush()

	for {
		response, err := stream.Recv()
		if err == io.EOF {
			break
		}
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		content := response.Choices[0].Delta.Content
		fmt.Fprintf(writer, "data: %s\n\n", content)
		writer.Flush()
	}

	return nil
}
