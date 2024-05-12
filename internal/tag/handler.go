package tag

import (
	"net/http"

	"github.com/ahmadrosid/readclip/internal/user"
	gofiberfirebaseauth "github.com/ahmadrosid/readclip/pkg/gofiberfirebaseauth"
	"github.com/gofiber/fiber/v2"
)

type TagHandler struct {
	repo     TagRepository
	userRepo user.UserRepository
}

func NewTagHandler(route fiber.Router, repo TagRepository, userRepo user.UserRepository) {
	handler := &TagHandler{
		repo,
		userRepo,
	}
	route.Get("/", handler.getAllTags)
	route.Post("/", handler.createNewTag)
	route.Post("/clip", handler.createClipTag)
	route.Get("/clip/:id", handler.getClipTags)
	route.Delete("/:id", handler.deleteClipTag)
	route.Delete("/clip/:tag_id/:clip_id", handler.deleteSelectedClipTag)
}

func (h *TagHandler) getUserID(c *fiber.Ctx) (string, error) {
	authUser := c.Locals("user").(gofiberfirebaseauth.User)
	user, err := h.userRepo.FindByFirebaseID(authUser.UserID)
	if err != nil {
		return "", err
	}

	return user.ID.String(), nil
}

func (h *TagHandler) createNewTag(c *fiber.Ctx) error {
	createTag := &RequestCreateTag{}
	if err := c.BodyParser(createTag); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	userID, err := h.getUserID(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	tag, err := h.repo.CreateNewTag(createTag.Name, userID)
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
	createClipTag := &RequestCreateClipTag{}
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

func (h *TagHandler) getClipTags(c *fiber.Ctx) error {
	clipId := c.Params("id")
	clipTag, err := h.repo.GetClipTag(clipId)
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
	userID, err := h.getUserID(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	tags, err := h.repo.GetAllTag(userID)
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

func (h *TagHandler) deleteClipTag(c *fiber.Ctx) error {
	id := c.Params("id")
	err := h.repo.DeleteTag(id)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error":  err.Error(),
			"status": "error",
		})
	}

	err = h.repo.DeleteClipTagByTagId(id)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error":  err.Error(),
			"status": "error",
		})
	}

	return c.Status(http.StatusAccepted).JSON(fiber.Map{
		"status": "success",
	})
}

func (h *TagHandler) deleteSelectedClipTag(c *fiber.Ctx) error {
	tag_id := c.Params("tag_id")
	clip_id := c.Params("clip_id")
	err := h.repo.RemoveTagFromClip(tag_id, clip_id)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error":  err.Error(),
			"status": "error",
		})
	}

	return c.Status(http.StatusAccepted).JSON(fiber.Map{
		"status": "success",
	})
}
