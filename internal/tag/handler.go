package tag

import (
	"net/http"

	"github.com/ahmadrosid/readclip/internal/user"
	"github.com/gofiber/fiber/v2"
	gofiberfirebaseauth "github.com/sacsand/gofiber-firebaseauth"
)

type TagHandler struct {
	repo     TagRepository
	userRepo user.UserRepository
}

func NewHandler(route fiber.Router, repo TagRepository, userRepo user.UserRepository) {
	handler := &TagHandler{
		repo,
		userRepo,
	}
	route.Get("/", handler.getAllTags)
	route.Post("/", handler.createNewTag)
	route.Post("/clip", handler.createClipTag)
	route.Get("/clip/:id", handler.getClipTags)
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
	createTag := &InputCreateTag{}
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
