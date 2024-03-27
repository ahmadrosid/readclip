package api

import (
	"net/http"

	"github.com/ahmadrosid/readclip/internal/util/echotube"
	"github.com/ahmadrosid/readclip/internal/util/youtube"
	"github.com/gofiber/fiber/v2"
)

type YoutubeTranscriptRequest struct {
	Url string
}

type FindChannelRequest struct {
	Query string
}

type youtubeHandler struct{}

func NewYoutubeHandler(route fiber.Router) {
	handler := &youtubeHandler{}
	route.Post("/transcript", handler.getYoutubeTranscript)
	route.Post("/channels", handler.findYoutubeChannels)
	route.Get("/video", handler.getVideoInfo)
}

func (h *youtubeHandler) getYoutubeTranscript(c *fiber.Ctx) error {
	var input YoutubeTranscriptRequest
	if err := c.BodyParser(&input); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  err.Error(),
		})
	}

	videoId, err := youtube.GetVideoID(input.Url)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  "invalid url",
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

func (h *youtubeHandler) findYoutubeChannels(c *fiber.Ctx) error {
	var input FindChannelRequest
	if err := c.BodyParser(&input); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  err.Error(),
		})
	}

	video, err := echotube.FindChannels(input.Query)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(video)
}

func (h *youtubeHandler) getVideoInfo(c *fiber.Ctx) error {
	videoId := c.Query("url")

	video, err := youtube.GetVideoInfo(videoId)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(video)
}
