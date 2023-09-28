package firebase

import (
	"context"
	"fmt"
	"net/http"

	"github.com/gofiber/fiber/v2"

	firebase "firebase.google.com/go"
	"github.com/ahmadrosid/readclip/internal/util/config"

	"google.golang.org/api/option"
)

func NewFirebaseApp(ctx context.Context, env *config.Config) (*firebase.App, error) {
	opt := option.WithCredentialsJSON([]byte(env.GoogleCredentials))
	app, err := firebase.NewApp(ctx, nil, opt)
	if err != nil {
		return nil, fmt.Errorf("error initializing app: %v", err)
	}

	return app, nil
}

func ErrorHandler(c *fiber.Ctx, err error) error {
	c.Status(http.StatusUnauthorized).JSON(fiber.Map{
		"status": "error",
		"error":  err.Error(),
	})

	if err.Error() == "Missing Token" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Missing or malformed Token",
		})
	}

	if err.Error() == "Malformed Token" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Missing or malformed Token",
		})
	}

	if err.Error() == "Email not verified" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Missing or malformed Token",
		})
	}

	if err.Error() == "Missing Firebase App Object" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Missing or Invalid Firebase App Object",
		})
	}

	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
		"status":  "error",
		"message": "Invalid or expired Token",
	})
}
