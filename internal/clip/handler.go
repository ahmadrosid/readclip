package clip

import (
	"bytes"
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"net/http"
	"time"

	"github.com/ahmadrosid/readclip/internal/user"
	"github.com/ahmadrosid/readclip/internal/util"
	"github.com/ahmadrosid/readclip/internal/util/logsnag"
	"github.com/ahmadrosid/readclip/internal/util/reddit"
	"github.com/ahmadrosid/readclip/internal/util/youtube"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	gofiberfirebaseauth "github.com/sacsand/gofiber-firebaseauth"
)

type GrabMarkdownRequest struct {
	Url string
}

type ExportClipRequest struct {
	Format string
}

type ClipHandler struct {
	repo     ClipRepository
	userRepo user.UserRepository
}

func NewHandler(route fiber.Router, repo ClipRepository, userRepo user.UserRepository) {
	handler := &ClipHandler{
		repo, userRepo,
	}
	route.Post("/", handler.grabClip)
	route.Get("/", handler.getAllClips)
	route.Delete("/:id", handler.deleteClipByID)
	route.Get("/:id/download", handler.downloadClipByID)
	route.Post("/export", handler.exportClips)
	route.Post("/scrape", handler.publicScrape)
}

func (h *ClipHandler) getUserID(c *fiber.Ctx) (*uuid.UUID, error) {
	authUser := c.Locals("user").(gofiberfirebaseauth.User)
	user, err := h.userRepo.FindByFirebaseID(authUser.UserID)
	if err != nil {
		return nil, err
	}

	return &user.ID, nil
}

func (h *ClipHandler) publicScrape(c *fiber.Ctx) error {
	// sleep for two seconds for testing purpose
	// time.Sleep(2 * time.Second)
	c.Accepts("application/json")

	var input GrabMarkdownRequest
	if err := c.BodyParser(&input); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  err.Error(),
		})
	}

	res, err := util.Scrape(input.Url, "markdown")
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  err.Error(),
		})
	}

	if res.Content == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  "content is empty",
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"status":           "success",
		"current_datetime": util.GetCurrentDatetime(),
		"data":             res,
	})
}

func (h *ClipHandler) grabClip(c *fiber.Ctx) error {
	// sleep for two seconds for testing purpose
	// time.Sleep(2 * time.Second)
	c.Accepts("application/json")

	var input GrabMarkdownRequest
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

	userID, err := h.getUserID(c)
	if err != nil {
		return c.Status(http.StatusForbidden).JSON(fiber.Map{
			"status": "error",
			"error":  err,
		})
	}

	hashURL := md5.Sum([]byte(input.Url))
	data, err := h.repo.GetClipByHashUrl(hex.EncodeToString(hashURL[:]), *userID)
	if err == nil {
		return c.JSON(fiber.Map{
			"status":           "success",
			"current_datetime": util.GetCurrentDatetime(),
			"data":             data,
		})
	}

	var res = &util.ContentData{}
	if youtube.IsValidYoutubeUrl(input.Url) {
		res, err = youtube.GrabYoutubeVideoInfo(input.Url)
		if err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"status": "error",
				"error":  err.Error(),
			})
		}
	} else if util.IsRedditUrl(input.Url) {
		res, err = reddit.ScrapeReddit(input.Url)
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

	now := time.Now().UTC()
	hostname, err := util.GetHostname(input.Url)
	if err != nil {
		fmt.Println(err)
	}

	clipData, err := h.repo.CreateClip(Clip{
		Id:          uuid.New(),
		Url:         input.Url,
		Title:       res.Title,
		HashUrl:     hex.EncodeToString(hashURL[:]),
		Description: res.Metadata.Description,
		Content:     res.Content,
		Hostname:    hostname,
		CreatedAt:   &now,
		UserID:      *userID,
	})

	go func() {
		if userID.String() != "4e868d22-439a-4b62-87d1-eba963774bca" {
			logsnag.SendClipEvent(input.Url, res.Title, userID.String())
		}
	}()

	if err != nil {
		return c.Status(http.StatusUnprocessableEntity).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
			"error":   err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"status":           "success",
		"current_datetime": util.GetCurrentDatetime(),
		"data":             clipData,
	})
}

func (h *ClipHandler) getAllClips(c *fiber.Ctx) error {
	tagId := c.Query("tag_id", "")
	page := c.QueryInt("page", 1)
	perPage := 99
	offset := (page - 1) * perPage

	userID, err := h.getUserID(c)
	if err != nil {
		return c.Status(http.StatusForbidden).JSON(fiber.Map{
			"status": "error",
			"error":  err,
		})
	}

	clips, err := h.repo.GetAllClipData(perPage, offset, tagId, *userID)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"status": "error",
			"error":  err.Error(),
		})
	}

	response := fiber.Map{
		"status":           "success",
		"current_datetime": util.GetCurrentDatetime(),
		"data":             clips,
		"page":             page,
		"per_page":         perPage,
		"total":            len(clips),
	}

	if len(clips) >= perPage {
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

	userID, err := h.getUserID(c)
	if err != nil {
		return c.Status(http.StatusForbidden).JSON(fiber.Map{
			"status": "error",
			"error":  err,
		})
	}

	err = h.repo.DeleteClipByID(id, *userID)
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

func (h *ClipHandler) downloadClipByID(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  "id is required",
		})
	}

	userID, err := h.getUserID(c)
	if err != nil {
		return c.Status(http.StatusForbidden).JSON(fiber.Map{
			"status": "error",
			"error":  err,
		})
	}

	clip, err := h.repo.GetClipById(id, *userID)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"status": "error",
			"error":  err.Error(),
		})
	}

	fileName := fmt.Sprintf("%s.md", clip.Title)
	c.Set("Content-Type", "text/plain")
	c.Set("Content-File-Name", fileName)
	c.Set("Content-Disposition", "attachment; filename="+fileName)

	return c.Status(http.StatusOK).SendStream(bytes.NewReader([]byte(clip.Content)))
}

func (h *ClipHandler) exportClips(c *fiber.Ctx) error {
	c.Accepts("application/json")
	var req ExportClipRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  err.Error(),
		})
	}

	userID, err := h.getUserID(c)
	if err != nil {
		return c.Status(http.StatusForbidden).JSON(fiber.Map{
			"status": "error",
			"error":  err,
		})
	}

	result, err := h.repo.ExportClips(req.Format, *userID)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"status": "error",
			"error":  err,
		})
	}

	if result == "" {
		return c.Status(http.StatusNoContent).JSON(fiber.Map{
			"status":  "success",
			"message": "No data to export",
		})
	}

	c.Set("Content-Type", "text/plain")
	if req.Format == "csv" {
		c.Set("Content-Disposition", "attachment; filename=clips.csv")
	} else {
		c.Set("Content-Disposition", "attachment; filename=clips.json")
	}

	return c.SendStream(bytes.NewReader([]byte(result)))
}
