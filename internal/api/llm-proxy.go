package api

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"os"

	"github.com/gofiber/fiber/v2"
	openai "github.com/sashabaranov/go-openai"
	"github.com/valyala/fasthttp"
)

type openaiHandler struct{}

func NewOpenAIHandler(route fiber.Router) {
	handler := &openaiHandler{}
	route.Post("/anyscale", handler.createCompletion)
}

func (h *openaiHandler) createCompletion(c *fiber.Ctx) error {
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
			"error": err.Error(), // TODO: add more details
		})
	}
	req.Stream = true

	// We don't use browser eventsource
	// c.Context().SetContentType("text/event-stream")
	// c.Context().Response.Header.Set("Cache-Control", "no-cache")
	// c.Context().Response.Header.Set("Connection", "keep-alive")
	// c.Context().Response.Header.Set("Transfer-Encoding", "chunked")
	c.Set("Content-Type", "application/octet-stream")
	c.Set("Cache-Control", "no-cache")
	c.Set("Connection", "keep-alive")
	c.Set("Transfer-Encoding", "chunked")

	c.Status(fiber.StatusOK).Context().SetBodyStreamWriter(fasthttp.StreamWriter(func(w *bufio.Writer) {
		stream, err := client.CreateChatCompletionStream(c.Context(), *req)
		if err != nil {
			fmt.Fprintf(w, "error: %v\n", err)
			w.Flush()
			return
		}
		defer stream.Close()

		for {
			response, err := stream.Recv()
			if err == io.EOF {
				break
			}
			if err != nil {
				fmt.Printf("Error while receiving response: %v\n", err)
				fmt.Fprintf(w, "error: %v\n", err)
				w.Flush()
				break
			}

			// content := response.Choices[0].Delta.Content
			// parse response into json string put in content variable
			content, err := json.Marshal(response)
			if err != nil {
				fmt.Printf("Error while marshaling response: %v\n", err)
				w.Flush()
				break
			}
			fmt.Fprintf(w, "data: %s\n\n", content)
			err = w.Flush()
			if err != nil {
				// Refreshing page in web browser will establish a new
				// SSE connection, but only (the last) one is alive, so
				// dead connections must be closed here.
				fmt.Printf("Error while flushing: %v. Closing http connection.\n", err)
				break
			}

		}
	}))

	return nil
}
