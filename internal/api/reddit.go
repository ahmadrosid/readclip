package api

import (
	"net/http"

	"github.com/ahmadrosid/readclip/internal/util"
	"github.com/ahmadrosid/readclip/internal/util/reddit"
	"github.com/gofiber/fiber/v2"
)

type RedditRequest struct {
	Url string
}

type redditHandler struct{}

func NewRedditHandler(route fiber.Router) {
	handler := &redditHandler{}
	route.Post("/grab", handler.getRedditpost)
}

func (h *redditHandler) getRedditpost(c *fiber.Ctx) error {
	var input RedditRequest
	if err := c.BodyParser(&input); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  err.Error(),
		})
	}

	if !util.IsRedditUrl(input.Url) {
		return c.Status(http.StatusUnprocessableEntity).JSON(fiber.Map{
			"status": "error",
			"error":  "invalid url",
		})
	}

	var oldRedditUrl = "https://old.reddit.com"
	var length = len(oldRedditUrl)
	var url = input.Url

	if url[0:length] == oldRedditUrl {
		url = "https://reddit.com" + url[length:]
	}

	println(url)

	data, err := reddit.ScrapeReddit(url)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(data)
}
