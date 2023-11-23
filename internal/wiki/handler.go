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
	route.Post("/", handler.Create)
	route.Get("/", handler.Get)
	route.Delete("/:id", handler.Delete)
	route.Patch("/:id", handler.Update)
}

func (h *WikiHandler) getUserID(c *fiber.Ctx) (*uuid.UUID, error) {
	authUser := c.Locals("user").(gofiberfirebaseauth.User)
	user, err := h.userRepo.FindByFirebaseID(authUser.UserID)
	if err != nil {
		return nil, err
	}

	return &user.ID, nil
}

func (h *WikiHandler) Create(c *fiber.Ctx) error {
	// Parse request body
	var createRequest struct {
		Title       string                 `json:"title"`
		Description string                 `json:"description"`
		Sidebar     map[string]interface{} `json:"sidebar"`
	}

	if err := c.BodyParser(&createRequest); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request payload"})
	}

	// Get user ID using the getUserID function
	userID, err := h.getUserID(c)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get user ID"})
	}

	// Call the repository to create a new Wiki
	wiki, err := h.repo.Create(createRequest.Title, createRequest.Description, createRequest.Sidebar, *userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create Wiki"})
	}

	// Return the created Wiki in the response
	return c.JSON(wiki)
}

func (h *WikiHandler) Get(c *fiber.Ctx) error {
	// Get Wiki ID from the request parameters
	wikiID := c.Params("id")

	// Get user ID using the getUserID function
	userID, err := h.getUserID(c)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get user ID"})
	}

	// Call the repository to get the Wiki
	wiki, err := h.repo.Get(wikiID, *userID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Wiki not found"})
	}

	// Return the retrieved Wiki in the response
	return c.JSON(wiki)
}

func (h *WikiHandler) Update(c *fiber.Ctx) error {
	// Get Wiki ID from the request parameters
	wikiID := c.Params("id")

	// Parse request body
	var updateRequest struct {
		Title       string                 `json:"title"`
		Description string                 `json:"description"`
		Sidebar     map[string]interface{} `json:"sidebar"`
	}

	if err := c.BodyParser(&updateRequest); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request payload"})
	}

	// Get user ID using the getUserID function
	userID, err := h.getUserID(c)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get user ID"})
	}

	// Call the repository to update the Wiki
	wiki, err := h.repo.Update(wikiID, updateRequest.Title, updateRequest.Description, updateRequest.Sidebar, *userID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Wiki not found"})
	}

	// Return the updated Wiki in the response
	return c.JSON(wiki)
}

func (h *WikiHandler) Delete(c *fiber.Ctx) error {
	// Get Wiki ID from the request parameters
	wikiID := c.Params("id")

	// Get user ID using the getUserID function
	userID, err := h.getUserID(c)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get user ID"})
	}

	// Call the repository to delete the Wiki
	err = h.repo.Delete(wikiID, *userID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Wiki not found"})
	}

	// Return a success message in the response
	return c.JSON(fiber.Map{"message": "Wiki deleted successfully"})
}
