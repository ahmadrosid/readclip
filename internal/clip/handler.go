package clip

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"net/http"
	"time"

	"github.com/ahmadrosid/readclip/internal/util"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type InputClip struct {
	Url string
}

type ClipHandler struct {
	repo ClipRepository
}

func NewHandler(route fiber.Router, ts ClipRepository) {
	handler := &ClipHandler{
		repo: ts,
	}
	route.Post("/", handler.grabClip)
	route.Get("/", handler.getAllClips)
	route.Delete("/:id", handler.deleteClipByID)
}

func (h *ClipHandler) grabClip(c *fiber.Ctx) error {
	// sleep for two seconds for testing purpose
	// time.Sleep(2 * time.Second)
	c.Accepts("application/json")

	var input InputClip
	if err := c.BodyParser(&input); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  err.Error(),
		})
	}

	if input.Url == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  "url is required",
		})
	}

	if !util.IsValidURL(input.Url) {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  "invalid url",
		})
	}

	hashURL := md5.Sum([]byte(input.Url))
	article, err := h.repo.GetClipByHashUrl(hex.EncodeToString(hashURL[:]))
	if err == nil {
		return c.JSON(fiber.Map{
			"status":           "success",
			"current_datetime": util.GetCurrentDatetime(),
			"data":             article,
		})
	}

	res := &util.ContentData{}
	if util.IsValidYoutubeUrl(input.Url) {
		res, err = util.GrabYoutubeVideoInfo(input.Url)
		if err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"status": "error",
				"error":  err.Error(),
			})
		}
	} else {
		res, err = util.Scrape(input.Url, "markdown")
		if err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"status": "error",
				"error":  err.Error(),
			})
		}
	}

	if res.Content == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  "content is empty",
		})
	}

	go func() {
		now := time.Now().UTC()
		hostname, err := util.GetHostname(input.Url)
		if err != nil {
			fmt.Println(err)
		}

		err = h.repo.CreateClip(Clip{
			Id:          uuid.New(),
			Url:         input.Url,
			Title:       res.Title,
			HashUrl:     hex.EncodeToString(hashURL[:]),
			Description: res.Metadata.Description,
			Content:     res.Content,
			Hostname:    hostname,
			CreatedAt:   &now,
		})
		if err != nil {
			fmt.Println(err)
		}
	}()

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"status":           "success",
		"current_datetime": util.GetCurrentDatetime(),
		"data":             res,
	})
}

func (h *ClipHandler) getAllClips(c *fiber.Ctx) error {
	page := c.QueryInt("page", 1)
	perPage := 99
	offset := (page - 1) * perPage

	articles, err := h.repo.GetAllClipData(perPage, offset)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"status": "error",
			"error":  err.Error(),
		})
	}

	response := fiber.Map{
		"status":           "success",
		"current_datetime": util.GetCurrentDatetime(),
		"data":             articles,
		"page":             page,
		"per_page":         perPage,
		"total":            len(articles),
	}

	if len(articles) >= perPage {
		response["nextCursor"] = page + 1
	}

	return c.Status(http.StatusOK).JSON(response)
}

func (h *ClipHandler) deleteClipByID(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  "id is required",
		})
	}

	err := h.repo.DeleteClipByID(id)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"status": "error",
			"error":  err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"status": "success",
	})
}
