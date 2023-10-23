package api

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/mmcdole/gofeed"
)

type RssFeedRequest struct {
	Url string
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
