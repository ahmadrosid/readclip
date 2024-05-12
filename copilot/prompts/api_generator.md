This is the documentation for how to create API endpoints for Readclip.

The folders:

```bash
.
├── api
│   ├── feed
│   │   ├── domain.go
│   │   ├── handler.go
│   │   └── repository.go
│   ├── html.go
│   ├── reddit.go
│   └── youtube.go
```

To create API endpoints, there are two ways to do it:

1. Create a new folder in the `api` folder and add a `domain.go`, `handler.go` and `repository.go` file.
2. Create new file in the `api` folder and add the api resource name for example `api/youtube.go`.

Let's break down the first method:

```bash
.
├── api
│   ├── feed
│   │   ├── domain.go
│   │   ├── handler.go
│   │   └── repository.go
```

Explanation:

1. The `domain.go` file is the file that contains the data structure of the API resource. In this file you can define orm struct for gorm library. The repository interface in struct for user request.

```go
package feed

import (
	"database/sql/driver"
	"encoding/json"
	"time"

	_ "github.com/lib/pq"

	"github.com/google/uuid"
)

type JSONB map[string]interface{}

func (j JSONB) Value() (driver.Value, error) {
	valueString, err := json.Marshal(j)
	return string(valueString), err
}

func (j *JSONB) Scan(value interface{}) error {
	if err := json.Unmarshal(value.([]byte), &j); err != nil {
		return err
	}
	return nil
}

type Feed struct {
	Id        uuid.UUID  `gorm:"primary_key;type:uuid;default:uuid_generate_v4()"`
	UserID    uuid.UUID  `gorm:"index;type:uuid"`
	Content   JSONB      `gorm:"type:JSONB"`
	ExpiredAt *time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	CreatedAt *time.Time `gorm:"default:CURRENT_TIMESTAMP"`
}

type RssFeedRequest struct {
	Url     string   `json:"url"`
	Type    string   `json:"type"`
	Options []string `json:"options"`
}

type FeedRepository interface {
	GetFeedById(id string, userID uuid.UUID) (Feed, error)
	CreateFeed(feed Feed) (Feed, error)
	DeleteFeedByID(id string, userID uuid.UUID) error
	UpdateFeed(feed Feed) error
}
```

2. The `handler.go` file is the file that contains the handler for the API resource. Most of the time the repository is used to query the database using the `gorm` library.

```go
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

func NewFeedHandler(route fiber.Router, repo FeedRepository, userRepo user.UserRepository) {
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
```

3. The `repository.go` file is the file that contains the repository for the API resource.

```go
package feed

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type feedRepository struct {
	db *gorm.DB
}

func NewFeedRepository(db *gorm.DB) FeedRepository {
	return &feedRepository{db}
}

func (repo *feedRepository) CreateFeed(feed Feed) (Feed, error) {
	err := repo.db.Create(&feed).Error
	return feed, err
}

func (repo *feedRepository) DeleteFeedByID(id string, userID uuid.UUID) error {
	return repo.db.Unscoped().
		Where("id = ?", id).
		Where("user_id = ?", userID).
		Delete(&Feed{}).Error
}

func (repo *feedRepository) UpdateFeed(feed Feed) error {
	return repo.db.Save(feed).Error
}

func (repo *feedRepository) GetFeedById(id string, userID uuid.UUID) (Feed, error) {
	var feed Feed
	err := repo.db.Where("id = ?", id).Where("user_id = ?", userID).First(&feed).Error
	return feed, err
}
```

The breakdown the second way to create API endpoints:

Sometime you don't need to create API to doesn't need to query the database. For example, you can create a file in the `api` folder and add the api resource name for example `api/youtube.go`.

Here's an example of how to create an API endpoint for a YouTube service:

```go
package api

import (
	"net/http"

	"github.com/ahmadrosid/readclip/internal/util/echotube"
	"github.com/ahmadrosid/readclip/internal/util/youtube"
	"github.com/gofiber/fiber/v2"
)

type YoutubeTranscriptRequest struct {
	Url string
}

type FindChannelRequest struct {
	Query string
}

type youtubeHandler struct{}

func NewYoutubeHandler(route fiber.Router) {
	handler := &youtubeHandler{}
	route.Post("/transcript", handler.getYoutubeTranscript)
	route.Post("/channels", handler.findYoutubeChannels)
	route.Get("/video", handler.getVideoInfo)
}

func (h *youtubeHandler) getYoutubeTranscript(c *fiber.Ctx) error {
	var input YoutubeTranscriptRequest
	if err := c.BodyParser(&input); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  err.Error(),
		})
	}

	videoId, err := youtube.GetVideoID(input.Url)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  "invalid url",
		})
	}

	video, err := echotube.GetTranscript(
		"https://www.youtube.com/watch?v=" + videoId,
	)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(video)
}

func (h *youtubeHandler) findYoutubeChannels(c *fiber.Ctx) error {
	var input FindChannelRequest
	if err := c.BodyParser(&input); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  err.Error(),
		})
	}

	video, err := echotube.FindChannels(input.Query)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(video)
}

func (h *youtubeHandler) getVideoInfo(c *fiber.Ctx) error {
	videoId := c.Query("url")

	video, err := youtube.GetVideoInfo(videoId)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(video)
}
```
