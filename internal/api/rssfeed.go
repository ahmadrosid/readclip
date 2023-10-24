package api

import (
	"net/http"

	"github.com/ahmadrosid/readclip/internal/util/github"
	"github.com/gofiber/fiber/v2"
	"github.com/mmcdole/gofeed"
)

type RssFeedRequest struct {
	Url     string   `json:"url"`
	Type    string   `json:"type"`
	Options []string `json:"options"`
}

type feedHandler struct{}

func NewFeedHandler(route fiber.Router) {
	handler := &feedHandler{}
	route.Post("/parse", handler.parseRssFeed)
}

func (*feedHandler) parseRssFeed(c *fiber.Ctx) error {
	var input RssFeedRequest
	if err := c.BodyParser(&input); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  err.Error(),
		})
	}

	if input.Type != "" {
		switch input.Type {
		case "github":
			result, err := github.FetchTrending(input.Options[0], input.Options[1])
			if err != nil {
				return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
					"status": "error",
					"error":  err.Error(),
				})
			}

			return c.Status(http.StatusOK).JSON(fiber.Map{
				"data": result,
			})
		}
	}

	fp := gofeed.NewParser()
	feed, err := fp.ParseURL(input.Url)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"data": feed,
	})
}
