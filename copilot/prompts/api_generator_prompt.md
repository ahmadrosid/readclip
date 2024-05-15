# Creating API Endpoints

In Readclip, API endpoints are organized in the `api` folder, similar to how the modules are organized in the `internal` folder.

The folder structure for API endpoints looks like this:

```bash
.
├── api
│   ├── feed
│   │   ├── domain.go
│   │   ├── handler.go
│   │   └── repository.go
│   └── youtube.go
```

There are two ways to create API endpoints:

1. Create a new folder in the `api` folder and add a `domain.go`, `handler.go`, and `repository.go` file.
2. Create a new file in the `api` folder and add the API resource name, for example, `api/youtube.go`.

### 1. Creating API Endpoints with a Folder Structure

Let's break down the first method:

1. The `domain.go` file defines the data structures for the API resource. This includes Gorm struct models, request/response structures, and the repository interface.

```go
// api/feed/domain.go
package feed

import (
	"database/sql/driver"
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type JSONB map[string]interface{}

// ... (model definitions and repository interface)
```

2. The `handler.go` file contains the handlers for the API endpoints. These handlers use the repository to interact with the database or perform other operations.

```go
// api/feed/handler.go
package feed

import (
	"github.com/ahmadrosid/readclip/internal/user"
	"github.com/gofiber/fiber/v2"
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

// ... (handler methods)
```

3. The `repository.go` file contains the repository implementation for the API resource.

```go
// api/feed/repository.go
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

// ... (repository methods)
```

To register the API endpoints, add the following to the `main.go` file:

```go
userRepo := user.NewUserRepository(db)
feed.NewFeedHandler(app.Group("/api/rss"), feed.NewFeedRepository(db), userRepo)
```

### 2. Creating API Endpoints with a Single File

Sometimes, an API endpoint doesn't require a database interaction, so you can create a single file in the `api` folder.

Here's an example of how to create an API endpoint for a YouTube service:

```go
// api/youtube.go
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

// ... (handler methods)
```

To register the API endpoint, add the following to the `main.go` file:

```go
api.NewYoutubeHandler(app.Group("/api/youtube"))
```

## For Your Reference

In the `main.go` file, we have already set up the necessary components for creating API endpoints, such as the database connection, config loading, and fiber app initialization.

Here's an example of the `main.go` file:

```go
func main() {
	env := config.Load()
	db, err := util.ConnectToDatabase(env.DatabaseUrl)
	if err != nil {
		panic(err)
	}

	// ... (other setup code)

	app := fiber.New(fiber.Config{
		JSONEncoder: json.Marshal,
		JSONDecoder: json.Unmarshal,
		Views:       engine,
	})

	userRepo := user.NewUserRepository(db)

	feed.NewFeedHandler(app.Group("/api/rss"), feed.NewFeedRepository(db), userRepo)
	api.NewYoutubeHandler(app.Group("/api/youtube"))

	// ... (other registration code)
}
```

You can follow this structure to create new API endpoints and integrate them into the Readclip codebase.