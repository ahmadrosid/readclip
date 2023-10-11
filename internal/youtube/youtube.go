package youtube

import (
	"net/http"

	"github.com/ahmadrosid/readclip/internal/util"
	"github.com/gofiber/fiber/v2"
	"github.com/kkdai/youtube/v2"
)

type YoutubeTranscriptRequest struct {
	Url string
}

type handler struct{}

func NewHandler(route fiber.Router) {
	handler := &handler{}
	route.Post("/transcript", handler.getYoutubeTranscript)
}

func (h *handler) getYoutubeTranscript(c *fiber.Ctx) error {
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

	videoID, err := util.GetVideoID(input.Url)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	client := youtube.Client{}
	video, err := client.GetTranscript(&youtube.Video{ID: videoID})
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"data":   video,
		"status": "success",
	})
}
