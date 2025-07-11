package user

import (
	"errors"
	"net/http"
	"time"

	"github.com/ahmadrosid/readclip/internal/util/logsnag"
	gofiberfirebaseauth "github.com/ahmadrosid/readclip/pkg/gofiberfirebaseauth"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type handler struct {
	repo UserRepository
}

func NewUserHandler(route fiber.Router, repo UserRepository) {
	handler := &handler{repo}
	route.Post("/login", handler.login)
	route.Post("/register", handler.register)
	route.Delete("/delete", handler.delete)
	route.Post("/update-username", handler.updateUserName)
}

func (h *handler) login(c *fiber.Ctx) error {
	currentUser := c.Locals("user").(gofiberfirebaseauth.User)
	user, err := h.repo.FindByFirebaseID(currentUser.UserID)

	if err != nil {
		if errors.Is(err, gorm.ErrDuplicatedKey) {
			return c.Status(http.StatusConflict).JSON(fiber.Map{
				"status": "error",
				"error":  "email already registered",
			})
		}

		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  err.Error(),
		})
	}

	if user.Name == "" {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"status": "error",
			"error":  "user not found",
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"data":   user,
		"status": "success",
	})
}

func (h *handler) register(c *fiber.Ctx) error {
	var input InputRegister
	if err := c.BodyParser(&input); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  err.Error(),
		})
	}

	currentUser := c.Locals("user").(gofiberfirebaseauth.User)

	now := time.Now().UTC()
	user, err := h.repo.Create(&User{
		ID:         uuid.New(),
		Name:       input.Name,
		Username:   nil,
		Email:      currentUser.Email,
		FirebaseID: currentUser.UserID,
		CreatedAt:  &now,
		UpdatedAt:  &now,
		DeletedAt:  nil,
	})

	if err != nil {
		if errors.Is(err, gorm.ErrDuplicatedKey) {
			return c.Status(http.StatusConflict).JSON(fiber.Map{
				"status": "error",
				"error":  "email already registered",
			})
		}

		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  err.Error(),
		})
	}

	go func() {
		logsnag.SendEventUserRegister(user.Name, user.ID.String())
	}()

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"data":   user,
		"status": "success",
	})
}

func (h *handler) delete(c *fiber.Ctx) error {
	currentUser := c.Locals("user").(gofiberfirebaseauth.User)
	user, err := h.repo.FindByFirebaseID(currentUser.UserID)

	if err != nil {
		if errors.Is(err, gorm.ErrDuplicatedKey) {
			return c.Status(http.StatusConflict).JSON(fiber.Map{
				"status": "error",
				"error":  "email already registered",
			})
		}

		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  err.Error(),
		})
	}

	err = h.repo.Delete(user.ID)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"status": "success",
	})
}

func (h *handler) updateUserName(c *fiber.Ctx) error {

	var updateRequest struct {
		Username string `json:"username"`
	}

	currentUser := c.Locals("user").(gofiberfirebaseauth.User)
	user, err := h.repo.FindByFirebaseID(currentUser.UserID)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  err.Error(),
		})
	}

	if err := c.BodyParser(&updateRequest); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request payload"})
	}

	updatedUser, err := h.repo.UpdateUsername(user, updateRequest.Username)
	if err != nil {
		return c.Status(http.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "Failed to update username! " + err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data":   updatedUser,
	})
}
