package api

import (
	"net/http"

	"github.com/ahmadrosid/readclip/internal/util"
	"github.com/ahmadrosid/readclip/internal/util/echotube"
	"github.com/gofiber/fiber/v2"
)

type YoutubeTranscriptRequest struct {
	Url string
}

type youtubeHandler struct{}

func NewYoutubeHandler(route fiber.Router) {
	handler := &youtubeHandler{}
	route.Post("/transcript", handler.getYoutubeTranscript)
}

func (h *youtubeHandler) getYoutubeTranscript(c *fiber.Ctx) error {
	var input YoutubeTranscriptRequest
	if err := c.BodyParser(&input); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  err.Error(),
		})
	}

	if !util.IsValidYoutubeUrl(input.Url) {
		return c.Status(http.StatusUnprocessableEntity).JSON(fiber.Map{
			"status": "error",
			"error":  "invalid url",
		})
	}

	videoId, err := util.GetVideoID(input.Url)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	video, err := echotube.GetTranscript(
		"https://www.youtube.com/watch?v=" + videoId,
	)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(video)
}
