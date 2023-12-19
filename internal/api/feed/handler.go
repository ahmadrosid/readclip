package feed

import (
	"fmt"
	"net/http"
	"time"

	"github.com/ahmadrosid/readclip/internal/scraper/hckrnews"
	"github.com/ahmadrosid/readclip/internal/scraper/indihacker"
	"github.com/ahmadrosid/readclip/internal/scraper/laravelnews"
	"github.com/ahmadrosid/readclip/internal/scraper/producthunt"
	"github.com/ahmadrosid/readclip/internal/scraper/reddit"
	"github.com/ahmadrosid/readclip/internal/user"
	"github.com/ahmadrosid/readclip/internal/util/github"
	gofiberfirebaseauth "github.com/ahmadrosid/readclip/pkg/gofiberfirebaseauth"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/mmcdole/gofeed"
)

type FeedHandler struct {
	repo     FeedRepository
	userRepo user.UserRepository
}

func NewHandler(route fiber.Router, repo FeedRepository, userRepo user.UserRepository) {
	handler := &FeedHandler{
		repo, userRepo,
	}
	route.Post("/parse", handler.getFeedById)
	route.Delete("/:id", handler.deleteFeedByID)
	route.Get("/github/languages", handler.githubLanguages)
}

func (*FeedHandler) githubLanguages(c *fiber.Ctx) error {
	result, err := github.FetchLanguages()
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"status": "error",
			"error":  err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(result)
}

func (h *FeedHandler) getUserID(c *fiber.Ctx) (*uuid.UUID, error) {
	userLocal := c.Locals("user")
	if userLocal == nil {
		return nil, fmt.Errorf("unauthorized")
	}
	authUser := userLocal.(gofiberfirebaseauth.User)
	user, err := h.userRepo.FindByFirebaseID(authUser.UserID)
	if err != nil {
		return nil, err
	}

	return &user.ID, nil
}

func (h *FeedHandler) saveToDB(c *fiber.Ctx, data fiber.Map, id string, savedFeed *Feed) (Feed, error) {
	userID, err := h.getUserID(c)
	if err != nil {
		return Feed{}, err
	}

	var expired = time.Now().UTC().Add(time.Minute * 5)
	if savedFeed != nil {
		savedFeed.Content = JSONB{
			"data": data["data"],
		}
		savedFeed.ExpiredAt = &expired
		return *savedFeed, h.repo.UpdateFeed(*savedFeed)
	}

	var feed = Feed{
		Id:     uuid.MustParse(id),
		UserID: *userID,
		Content: JSONB{
			"data": data["data"],
		},
		ExpiredAt: &expired,
	}

	return h.repo.CreateFeed(feed)
}

func (h *FeedHandler) parseRssFeed(c *fiber.Ctx, data *Feed, id string) error {
	var input RssFeedRequest
	if err := c.BodyParser(&input); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  err.Error(),
		})
	}

	switch input.Type {
	case "github":
		trending, err := github.FetchTrending(input.Options[0], input.Options[1])
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"status": "error",
				"error":  err.Error(),
			})
		}

		feed, err := h.saveToDB(c, fiber.Map{
			"data": trending,
		}, id, data)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"status": "error",
				"error":  err.Error(),
			})
		}
		return c.Status(http.StatusOK).JSON(fiber.Map{
			"data": trending,
			"id":   feed.Id,
		})
	case "hackernews":
		news, err := hckrnews.FetchHackernews()
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"status": "error",
				"error":  err.Error(),
			})
		}

		feed, err := h.saveToDB(c, fiber.Map{
			"data": news,
		}, id, data)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"status": "error",
				"error":  err.Error(),
			})
		}
		return c.Status(http.StatusOK).JSON(fiber.Map{
			"data": news,
			"id":   feed.Id,
		})
	case "indiehacker":
		news, err := indihacker.FetchIndihacker(input.Options[0])
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"status": "error",
				"error":  err.Error(),
			})
		}

		feed, err := h.saveToDB(c, fiber.Map{
			"data": news,
		}, id, data)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"status": "error",
				"error":  err.Error(),
			})
		}
		return c.Status(http.StatusOK).JSON(fiber.Map{
			"data": news,
			"id":   feed.Id,
		})
	case "laravelnews":
		news, err := laravelnews.ParseBlogPage()
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"status": "error",
				"error":  err.Error(),
			})
		}

		feed, err := h.saveToDB(c, fiber.Map{
			"data": news,
		}, id, data)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"status": "error",
				"error":  err.Error(),
			})
		}
		return c.Status(http.StatusOK).JSON(fiber.Map{
			"data": news,
			"id":   feed.Id,
		})
	case "producthunt":
		news, err := producthunt.ParseHomePage()
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"status": "error",
				"error":  err.Error(),
			})
		}

		feed, err := h.saveToDB(c, fiber.Map{
			"data": news,
		}, id, data)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"status": "error",
				"error":  err.Error(),
			})
		}
		return c.Status(http.StatusOK).JSON(fiber.Map{
			"data": news,
			"id":   feed.Id,
		})
	case "reddit":
		news, err := reddit.GetSubreddit(input.Options[0])
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"status": "error",
				"error":  err.Error(),
			})
		}

		feed, err := h.saveToDB(c, fiber.Map{
			"data": news,
		}, id, data)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"status": "error",
				"error":  err.Error(),
			})
		}
		return c.Status(http.StatusOK).JSON(fiber.Map{
			"data": news,
			"id":   feed.Id,
		})
	default:
		if input.Type == "youtube" {
			input.Url = fmt.Sprintf("https://www.youtube.com/feeds/videos.xml?channel_id=%s", input.Options[0])
		} else if input.Type == "reddit" {
			if len(input.Options) == 0 {
				return c.Status(http.StatusUnprocessableEntity).JSON(fiber.Map{
					"status": "error",
					"error":  "Please provide reddit room name",
				})
			}
			input.Url = reddit.GenerateRedditRssUrl(input.Options[0])
		}

		fp := gofeed.NewParser()
		feed, err := fp.ParseURL(input.Url)
		if err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"status": "error",
				"error":  err.Error(),
			})
		}

		feedDb, err := h.saveToDB(c, fiber.Map{
			"data": feed,
		}, id, data)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"status": "error",
				"error":  err.Error(),
			})
		}
		return c.Status(http.StatusOK).JSON(fiber.Map{
			"data": feed,
			"id":   feedDb.Id,
		})
	}
}

func (h *FeedHandler) getFeedById(c *fiber.Ctx) error {
	id := c.Query("id")
	if id == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  "id is required",
		})
	}

	userID, err := h.getUserID(c)
	if err != nil {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
			"status": "error",
			"error":  err,
		})
	}

	feed, err := h.repo.GetFeedById(id, *userID)
	if err != nil {
		return h.parseRssFeed(c, nil, id)
	}

	now := time.Now().UTC()
	if now.Before(*feed.ExpiredAt) {
		return c.Status(http.StatusOK).JSON(fiber.Map{
			"id":   feed.Id,
			"data": feed.Content["data"],
		})
	}

	return h.parseRssFeed(c, &feed, id)
}

func (h *FeedHandler) deleteFeedByID(c *fiber.Ctx) error {
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

	err = h.repo.DeleteFeedByID(id, *userID)
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
