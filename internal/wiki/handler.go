package wiki

import (
	"github.com/ahmadrosid/readclip/internal/user"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	gofiberfirebaseauth "github.com/sacsand/gofiber-firebaseauth"
)

type WikiHandler struct {
	repo     WikiRepository
	userRepo user.UserRepository
}

func NewHandler(route fiber.Router, repo WikiRepository, userRepo user.UserRepository) {
	handler := &WikiHandler{
		repo, userRepo,
	}
	route.Post("/create", handler.Create)
	route.Get("/current", handler.GetByUserID)
	route.Get("/:id", handler.Get)
	route.Delete("/:id", handler.Delete)
	route.Patch("/:id", handler.Update)
}

func (h *WikiHandler) getUser(c *fiber.Ctx) (*user.User, error) {
	authUser := c.Locals("user").(gofiberfirebaseauth.User)
	user, err := h.userRepo.FindByFirebaseID(authUser.UserID)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (h *WikiHandler) getUserID(c *fiber.Ctx) (*uuid.UUID, error) {
	user, err := h.getUser(c)
	if err != nil {
		return nil, err
	}

	return &user.ID, nil
}

func (h *WikiHandler) Create(c *fiber.Ctx) error {
	var createRequest struct {
		Title       string                 `json:"title"`
		Description string                 `json:"description"`
		Sidebar     map[string]interface{} `json:"sidebar"`
	}

	if err := c.BodyParser(&createRequest); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request payload"})
	}

	user, err := h.getUser(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Failed to get user ID"})
	}

	println(len(user.Username))

	if len(user.Username) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Please create username"})
	}

	wiki, err := h.repo.Create(createRequest.Title, createRequest.Description, createRequest.Sidebar, user.ID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create Wiki"})
	}

	return c.JSON(wiki)
}

func (h *WikiHandler) GetByUserID(c *fiber.Ctx) error {
	userID, err := h.getUserID(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Failed to get user ID"})
	}

	wiki, err := h.repo.GetByUserID(*userID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Wiki not found"})
	}

	return c.JSON(wiki)
}

func (h *WikiHandler) Get(c *fiber.Ctx) error {
	wikiID := c.Params("id")

	if wikiID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "WikiID is Required!"})
	}

	userID, err := h.getUserID(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Failed to get user ID"})
	}

	wiki, err := h.repo.Get(wikiID, *userID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Wiki not found"})
	}

	return c.JSON(wiki)
}

func (h *WikiHandler) Update(c *fiber.Ctx) error {
	wikiID := c.Params("id")

	if wikiID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "WikiID is Required!"})
	}

	var updateRequestBody struct {
		Title       string                 `json:"title"`
		Description string                 `json:"description"`
		Sidebar     map[string]interface{} `json:"sidebar"`
	}

	if err := c.BodyParser(&updateRequestBody); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request payload"})
	}

	userID, err := h.getUserID(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Failed to get user ID"})
	}

	wiki, err := h.repo.Update(wikiID, updateRequestBody.Title, updateRequestBody.Description, updateRequestBody.Sidebar, *userID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Wiki not found"})
	}

	return c.JSON(wiki)
}

func (h *WikiHandler) Delete(c *fiber.Ctx) error {
	wikiID := c.Params("id")

	if wikiID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "WikiID is Required!"})
	}

	userID, err := h.getUserID(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Failed to get user ID"})
	}

	err = h.repo.Delete(wikiID, *userID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Wiki not found"})
	}

	return c.JSON(fiber.Map{"message": "Wiki deleted successfully"})
}
