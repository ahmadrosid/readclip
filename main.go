package main

import (
	"context"
	"io/fs"
	"net/http"
	"strings"

	gofiberfirebaseauth "github.com/sacsand/gofiber-firebaseauth"

	"github.com/ahmadrosid/readclip/internal/api"
	"github.com/ahmadrosid/readclip/internal/bookmark"
	"github.com/ahmadrosid/readclip/internal/clip"
	"github.com/ahmadrosid/readclip/internal/tag"
	"github.com/ahmadrosid/readclip/internal/user"
	"github.com/ahmadrosid/readclip/internal/util"
	"github.com/ahmadrosid/readclip/internal/util/config"
	"github.com/ahmadrosid/readclip/internal/util/embedfile"
	"github.com/ahmadrosid/readclip/internal/util/firebase"
	"github.com/ahmadrosid/readclip/ui"
	"github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/gofiber/fiber/v2/middleware/recover"
	_ "github.com/lib/pq"
)

func main() {
	env := config.Load()
	index, err := fs.Sub(ui.Index, "dist")
	if err != nil {
		panic(err)
	}

	db, _ := util.ConnectToDatabase(env.DatabaseUrl)
	app := fiber.New(fiber.Config{
		JSONEncoder: json.Marshal,
		JSONDecoder: json.Unmarshal,
	})

	serveUI := func(ctx *fiber.Ctx) error {
		return filesystem.SendFile(ctx, http.FS(index), "index.html")
	}

	uiPaths := []string{
		"/",
		"/clip",
		"/register",
		"/clips",
		"/setting",
		"/login",
		"/tools",
		"/tools/word-counter",
		"/tools/reading-time",
		"/tools/markdown-editor",
	}

	for _, path := range uiPaths {
		app.Get(path, serveUI)
	}

	app.Use("/", filesystem.New(filesystem.Config{
		Root:   http.FS(index),
		Index:  "index.html",
		Browse: false,
	}))

	app.Get("/tools/youtube-transcriber", func(c *fiber.Ctx) error {
		fs := http.FS(index)
		oldURL := "https://readclip.ahmadrosid.com/img/readclip.png"
		newURL := "https://res.cloudinary.com/dr15yjl8w/image/upload/v1697703742/pika-1697703705648-1x_hh34kn.png"

		newHtml, err := embedfile.ReplaceStrInFile(fs, "index.html", oldURL, newURL)
		if err != nil {
			return c.SendStatus(http.StatusInternalServerError)
		}

		newHtml = strings.Replace(newHtml, "https://readclip.ahmadrosid.com", "https://readclip.ahmadrosid.com/tools/youtube-transcriber", -1)
		newHtml = strings.Replace(newHtml, `content="ReadClip"`, `content="ReadClip - Youtube transcriber"`, -1)

		c.Type("html")
		c.Status(http.StatusOK)

		return c.SendString(newHtml)
	})

	app.Get("/tools/reddit-reader", func(c *fiber.Ctx) error {
		fs := http.FS(index)
		oldURL := "https://readclip.ahmadrosid.com/img/readclip.png"
		newURL := "https://res.cloudinary.com/dr15yjl8w/image/upload/v1697776546/reddit-reader_xnnb9v.png"

		newHtml, err := embedfile.ReplaceStrInFile(fs, "index.html", oldURL, newURL)
		if err != nil {
			return c.SendStatus(http.StatusInternalServerError)
		}

		newHtml = strings.Replace(newHtml, "https://readclip.ahmadrosid.com", "https://readclip.ahmadrosid.com/tools/reddit-reader", -1)
		newHtml = strings.Replace(newHtml, `content="ReadClip"`, `content="ReadClip - Reddit reader"`, -1)

		c.Type("html")
		c.Status(http.StatusOK)

		return c.SendString(newHtml)
	})

	app.Use(recover.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000, http://127.0.0.1:8000",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	ctx := context.Background()
	firebaseApp, err := firebase.NewFirebaseApp(ctx, env)
	if err != nil {
		panic(err)
	}

	app.Use(gofiberfirebaseauth.New(gofiberfirebaseauth.Config{
		FirebaseApp: firebaseApp,
		IgnoreUrls: []string{
			"GET::/",
			"GET::/favicon.ico",
			"GET::/login",
			"GET::/register",
			"GET::/clips",
			"GET::/setting",
			"POST::/api/youtube/transcript",
			"GET::/tools/*",
			"GET::/sw.js",
		},
		ErrorHandler: firebase.ErrorHandler,
	}))

	userRepo := user.NewUserRepository(db)
	clip.NewHandler(
		app.Group("/api/clips"),
		clip.NewClipRepository(db),
		userRepo,
	)
	tag.NewHandler(
		app.Group("/api/tags"),
		tag.NewTagRepository(db),
		userRepo,
	)
	bookmark.NewHandler(
		app.Group("/api/bookmarks"),
	)
	api.NewYoutubeHandler(
		app.Group("/api/youtube"),
	)
	api.NewRedditHandler(
		app.Group("/api/reddit"),
	)
	user.NewHandler(
		app.Group("/api/users"),
		userRepo,
	)
	app.Listen("0.0.0.0:" + env.Port)
	// app.Listen(":" + env.Port)
}
