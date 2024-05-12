This is how module works in the Readclip codebase.

## What is a module?

A module is a self-contained piece of code that performs a specific task. It can be a function, a class, or a module. Modules are used to organize and reuse code, making it easier to manage and maintain large projects.

In readclip codebase module are placed in the `internal` folder. Inside that folder you can define the module name as the subfolder. Here's an example of tag module folder structure:

```bash
.
├── tag
│   ├── domain.go
│   ├── handler.go
│   └── repository.go
```

Here's and example code for module `tag`:

**internal/tag/domain.go:** A file to define the domain model for the tag module. It contains gorm struct model for table `clip_tag` and `tag`. Struct to model user request body eg `RequestCreateTag` and `RequestCreateClipTag`. Struct to model the interface for the tag repository (eg `TagRepository`).

```go
// tag/domain.go
package tag

import (
	"time"

	"github.com/google/uuid"
)

type ClipTag struct {
	Id        uuid.UUID  `gorm:"primary_key;type:uuid;default:uuid_generate_v4()"`
	TagID     uuid.UUID  `gorm:"type:uuid;index:idx_unique_tag,unique"`
	ClipID    uuid.UUID  `gorm:"type:uuid;index:idx_unique_tag,unique"`
	CreatedAt *time.Time `gorm:"default:CURRENT_TIMESTAMP"`
}

type Tag struct {
	Id        uuid.UUID  `gorm:"primary_key;type:uuid;default:uuid_generate_v4()"`
	UserID    uuid.UUID  `gorm:"type:uuid"`
	Name      string     `gorm:"size:100"`
	CreatedAt *time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt *time.Time `gorm:"default:CURRENT_TIMESTAMP"`
}

type RequestCreateTag struct {
	Name string `json:"name"`
}

type RequestCreateClipTag struct {
	ClipId string `json:"clip_id"`
	TagId  string `json:"tag_id"`
}

type TagRepository interface {
	CreateNewTag(name string, userId string) (*Tag, error)
	GetAllTag(userId string) ([]Tag, error)
	AddTagToClip(articleId string, tagId string) (*ClipTag, error)
	GetClipTag(clipId string) ([]Tag, error)
	DeleteClipTagByTagId(id string) error
	RemoveTagFromClip(tagId string, clipId string) error
	DeleteTag(id string) error
}
```

**internal/tag/handler.go:** A file to define the handler for the tag module. It will handle the endpoint for creating a new tag, creating a clip tag, getting all tags, getting clip tags, deleting a tag, and deleting a clip tag.

```go
// tag/handler.go
package tag

import (
	"net/http"

	"github.com/ahmadrosid/readclip/internal/user"
	gofiberfirebaseauth "github.com/ahmadrosid/readclip/pkg/gofiberfirebaseauth"
	"github.com/gofiber/fiber/v2"
)

type TagHandler struct {
	repo     TagRepository
	userRepo user.UserRepository
}

func NewTagHandler(route fiber.Router, repo TagRepository, userRepo user.UserRepository) {
	handler := &TagHandler{
		repo,
		userRepo,
	}
	route.Get("/", handler.getAllTags)
	route.Post("/", handler.createNewTag)
	route.Post("/clip", handler.createClipTag)
	route.Get("/clip/:id", handler.getClipTags)
	route.Delete("/:id", handler.deleteClipTag)
	route.Delete("/clip/:tag_id/:clip_id", handler.deleteSelectedClipTag)
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
	createTag := &RequestCreateTag{}
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
	createClipTag := &RequestCreateClipTag{}
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

func (h *TagHandler) deleteClipTag(c *fiber.Ctx) error {
	id := c.Params("id")
	err := h.repo.DeleteTag(id)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error":  err.Error(),
			"status": "error",
		})
	}

	err = h.repo.DeleteClipTagByTagId(id)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error":  err.Error(),
			"status": "error",
		})
	}

	return c.Status(http.StatusAccepted).JSON(fiber.Map{
		"status": "success",
	})
}

func (h *TagHandler) deleteSelectedClipTag(c *fiber.Ctx) error {
	tag_id := c.Params("tag_id")
	clip_id := c.Params("clip_id")
	err := h.repo.RemoveTagFromClip(tag_id, clip_id)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error":  err.Error(),
			"status": "error",
		})
	}

	return c.Status(http.StatusAccepted).JSON(fiber.Map{
		"status": "success",
	})
}
```

**internal/tag/repository.go:** A file to define the repository for the tag module. In this file you can do any operation related to data mutation or querying the database using gorm.

```go
// tag/repository.go
package tag

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type tagRepository struct {
	db *gorm.DB
}

func (repo *tagRepository) DeleteClipTagByTagId(id string) error {
	return repo.db.Where("tag_id = ?", id).Delete(&ClipTag{}).Error
}

func (repo *tagRepository) RemoveTagFromClip(tagId string, clipId string) error {
	return repo.db.Where("tag_id = ?", tagId).Where("clip_id = ?", clipId).Delete(&ClipTag{}).Error
}

func (repo *tagRepository) DeleteTag(id string) error {
	return repo.db.Where("id = ?", id).Delete(&Tag{}).Error
}

func (repo *tagRepository) GetClipTag(clipId string) ([]Tag, error) {
	var tags []Tag
	err := repo.db.Select("tags.*").
		Joins("INNER JOIN clip_tags ON tags.id = clip_tags.tag_id").
		Where("clip_tags.clip_id = ?", clipId).
		Find(&tags).Error
	return tags, err
}

func (repo *tagRepository) AddTagToClip(clipId string, tagId string) (*ClipTag, error) {
	var now = time.Now().UTC()
	var clipTag = &ClipTag{
		ClipID:    uuid.MustParse(clipId),
		TagID:     uuid.MustParse(tagId),
		CreatedAt: &now,
	}
	err := repo.db.Create(
		clipTag,
	).Error
	return clipTag, err
}

func (repo *tagRepository) CreateNewTag(name string, userId string) (*Tag, error) {
	var now = time.Now().UTC()
	var tag = &Tag{
		Name:      name,
		UserID:    uuid.MustParse(userId),
		CreatedAt: &now,
		UpdatedAt: &now,
	}
	err := repo.db.Create(tag).Error
	return tag, err
}

func (repo *tagRepository) GetAllTag(userId string) ([]Tag, error) {
	var tags []Tag
	err := repo.db.Where("user_id = ?", userId).Order("name ASC").Find(&tags).Error
	return tags, err
}

func NewTagRepository(db *gorm.DB) TagRepository {
	return &tagRepository{
		db: db,
	}
}
```

## How do I create a module?

To create a module, you need to create a new folder in the `internal` folder. Inside that folder you can define the module name as the subfolder. Here's an example of tag module folder structure:

```bash
.
├── profile
│   ├── domain.go
│   ├── handler.go
│   └── repository.go
```

And the code for that module you can follow the example in the `tag` module.

After creating the module, you need to register it in the `main.go` file. Here's an example of how to register the tag module:

```go
// main.go
package main

import (
    ...
	"github.com/ahmadrosid/readclip/internal/tag"
    ...
)

func main() {
    ...
	userRepo := user.NewUserRepository(db)
	tagRepo := tag.NewTagRepository(db)
	tag.NewProfileHandler(app.Group("/profile"), tagRepo, userRepo)  
    ...
}
```

Sometime some module might not need a database, so for that you can skip the creation of the database gorm struct and the repository might don't do any database operation.

## For your reference

In the `main.go` file we have everything ready like database connection setup, registering the modules, and starting the server.

We also already has a config that we can use to load the environment variables.

And here's the code for the `config` package:

```go
// config/config.go
package config

import (
	"log"

	"github.com/caarlos0/env/v11"
	"github.com/joho/godotenv"
)

type Config struct {
	Port              string `env:"PORT" envDefault:"8080"`
	GoogleCredentials string `env:"GOOGLE_APPLICATION_CREDENTIALS" envDefault:""`
	DatabaseUrl       string `env:"DATABASE_URL" envDefault:""`
	Uptash            Uptash `envPrefix:"UPSTASH_"`
}

type Uptash struct {
	VectorDatabaseUrl   string `env:"VECTOR_DB_URL"`
	VectorDatabaseToken string `env:"VECTOR_DB_TOKEN"`
}

func Load() *Config {
	godotenv.Load()
	cfg := &Config{}
	if err := env.Parse(cfg); err != nil {
		log.Fatal(err)
	}
	return cfg
}
```

You can add more config variables to this file and if you need and use them in your modules. But most of the time you don't to add more config.

The other note you might want to know is the go.mod file, which is you can use to see what are the dependencies of the readclip project. Here's the code for the `go.mod` file:

```
module github.com/ahmadrosid/readclip

go 1.21

require (
	firebase.google.com/go v3.13.0+incompatible
	github.com/JohannesKaufmann/html-to-markdown v1.4.1
	github.com/andygrunwald/go-trending v0.0.0-20231024092240-c15f8d9c1844
	github.com/caarlos0/env/v11 v11.0.0
	github.com/go-shiori/dom v0.0.0-20230515143342-73569d674e1c
	github.com/goccy/go-json v0.10.2
	github.com/gofiber/fiber/v2 v2.48.0
	github.com/gofiber/template/html/v2 v2.0.5
	github.com/google/uuid v1.3.1
	github.com/joho/godotenv v1.5.1
	github.com/kkdai/youtube/v2 v2.10.1
	github.com/lib/pq v1.10.9
	github.com/markusmobius/go-trafilatura v1.5.1
	github.com/milosgajdos/go-embeddings v0.3.2
	github.com/mmcdole/gofeed v1.2.1
	github.com/stretchr/testify v1.9.0
	github.com/upstash/vector-go v0.4.0
	golang.org/x/net v0.22.0
	google.golang.org/api v0.143.0
	gorm.io/driver/postgres v1.5.2
	gorm.io/gorm v1.25.4
)
```

