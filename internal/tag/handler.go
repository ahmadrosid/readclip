package tag

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
)

type TagHandler struct {
	repo TagRepository
}

func NewHandler(route fiber.Router, ts TagRepository) {
	handler := &TagHandler{
		repo: ts,
	}
	route.Get("/", handler.getAllTags)
	route.Post("/", handler.createNewTag)
	route.Post("/clip", handler.createClipTag)
}

func (h *TagHandler) createNewTag(c *fiber.Ctx) error {
	createTag := &InputCreateTag{}
	if err := c.BodyParser(createTag); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	tag, err := h.repo.CreateNewTag(createTag.Name, defaultUserID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(&fiber.Map{
		"status": "success",
		"data":   tag,
	})
}

func (h *TagHandler) createClipTag(c *fiber.Ctx) error {
	createClipTag := &InputCreateClipTag{}
	if err := c.BodyParser(createClipTag); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	clipTag, err := h.repo.AddTagToClip(createClipTag.ClipId, createClipTag.TagId)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(&fiber.Map{
		"status": "success",
		"data":   clipTag,
	})
}

func (h *TagHandler) getAllTags(c *fiber.Ctx) error {
	tags, err := h.repo.GetAllTag(defaultUserID)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data":   tags,
	})
}
