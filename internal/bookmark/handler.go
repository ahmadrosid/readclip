package bookmark

import (
	"fmt"
	"net/http"

	"github.com/ahmadrosid/readclip/internal/util"
	"github.com/gofiber/fiber/v2"
)

type handler struct{}

func NewHandler(route fiber.Router) {
	handler := &handler{}
	route.Post("/import/chrome", handler.parseChromeBookmark)
}

func (h *handler) parseChromeBookmark(c *fiber.Ctx) error {
	upload, err := c.FormFile("document")
	if err != nil {
		println(err.Error())
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error":  err.Error(),
			"status": "error",
		})
	}

	file, err := upload.Open()
	fmt.Printf("Header: %+v\n", upload.Header)
	fmt.Printf("Size: %+v\n", upload.Size)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error":  err.Error(),
			"status": "error",
		})
	}
	defer file.Close()

	bookmarks, err := util.ParseBookmarks(file)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"data":   bookmarks,
		"status": "success",
	})
}
