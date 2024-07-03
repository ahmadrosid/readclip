package main

import (
	"context"
	"fmt"
	"io/fs"
	"net/http"
	"strings"

	gofiberfirebaseauth "github.com/ahmadrosid/readclip/pkg/gofiberfirebaseauth"

	"github.com/ahmadrosid/readclip/internal/api"
	"github.com/ahmadrosid/readclip/internal/api/feed"
	"github.com/ahmadrosid/readclip/internal/bookmark"
	"github.com/ahmadrosid/readclip/internal/clip"
	"github.com/ahmadrosid/readclip/internal/tag"
	"github.com/ahmadrosid/readclip/internal/user"
	"github.com/ahmadrosid/readclip/internal/util"
	"github.com/ahmadrosid/readclip/internal/util/config"
	"github.com/ahmadrosid/readclip/internal/util/embedfile"
	"github.com/ahmadrosid/readclip/internal/util/firebase"
	"github.com/ahmadrosid/readclip/internal/wiki"
	"github.com/ahmadrosid/readclip/ui"
	"github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/template/html/v2"
	_ "github.com/lib/pq"
)

func main() {
	env := config.Load()
	db, err := util.ConnectToDatabase(env.DatabaseUrl)
	if err != nil {
		panic(err)
	}

	index, err := fs.Sub(ui.Index, "dist")
	if err != nil {
		panic(err)
	}

	template, err := fs.Sub(ui.Template, "template")
	if err != nil {
		panic(err)
	}

	engine := html.NewFileSystem(http.FS(template), ".html")

	app := fiber.New(fiber.Config{
		JSONEncoder: json.Marshal,
		JSONDecoder: json.Unmarshal,
		Views:       engine,
	})

	if env.DebugMode {
		app.Use(logger.New())
		app.Use("/api", logger.New(logger.Config{
			Format: "[${time}] ${status} - ${latency} ${method} ${path} - ${body}\n",
		}))
	}

	app.Get("/page", func(c *fiber.Ctx) error {
		return c.Render("index", fiber.Map{
			"Title": "Welcome home",
		})
	})

	app.Use("/", func(ctx *fiber.Ctx) error {
		if ctx.BaseURL() == "https://readclip.ahmadrosid.com" {
			return ctx.Redirect(fmt.Sprintf("https://readclip.site%s", ctx.Path()), http.StatusMovedPermanently)
		}
		return ctx.Next()
	})

	serveUI := func(ctx *fiber.Ctx) error {
		return filesystem.SendFile(ctx, http.FS(index), "index.html")
	}

	uiPaths := []string{
		"/clip",
		"/register",
		"/clips",
		"/feed-deck",
		"/setting",
		"/login",
		"/tools",
		"/tools/word-counter",
		"/tools/reading-time",
		"/tools/markdown-editor",
		"/explore-rss",
		"/collections",
	}

	for _, path := range uiPaths {
		app.Get(path, serveUI)
	}

	app.Use("/", filesystem.New(filesystem.Config{
		Root:   http.FS(index),
		Index:  "index.html",
		Browse: false,
	}))

	app.All("/assets/*.js", func(ctx *fiber.Ctx) error {
		ctx.Set(fiber.HeaderContentType, "application/javascript")
		return ctx.Next()
	})

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
		newHtml = strings.Replace(newHtml,
			`content="ReadClip - Your Personal Knowledge Library: Save, Organize, and Enjoy - Readclip, Your Reading Companion."`,
			`content="Youtube Transcriber - Don't really have time to watch videos? Now you can read them!"`, -1)

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
		newHtml = strings.Replace(newHtml,
			`content="ReadClip - Your Personal Knowledge Library: Save, Organize, and Enjoy - Readclip, Your Reading Companion."`,
			`content="Read reddit discussion without distraction wihtout a pain!"`, -1)

		c.Type("html")
		c.Status(http.StatusOK)

		return c.SendString(newHtml)
	})

	app.Get("/tools/business-analysis", func(c *fiber.Ctx) error {
		fs := http.FS(index)

		oldURL := "https://readclip.ahmadrosid.com/img/readclip.png"
		newURL := "https://res.cloudinary.com/dr15yjl8w/image/upload/v1697992261/pika-1697992229212-1x_s8krxd.png"

		newHtml, err := embedfile.ReplaceStrInFile(fs, "index.html", oldURL, newURL)
		if err != nil {
			return c.SendStatus(http.StatusInternalServerError)
		}

		newHtml = strings.Replace(newHtml, "https://readclip.ahmadrosid.com", "https://readclip.ahmadrosid.com/tools/business-analysis", -1)
		newHtml = strings.Replace(newHtml, `content="ReadClip"`, `content="ReadClip - Business Value Proposition Analysis"`, -1)
		newHtml = strings.Replace(newHtml,
			`content="ReadClip - Your Personal Knowledge Library: Save, Organize, and Enjoy - Readclip, Your Reading Companion."`,
			`content="Business Value Proposition Analysis - Find out Business Value Proposition Statement from landing page using AI."`, -1)

		c.Type("html")
		c.Status(http.StatusOK)

		return c.SendString(newHtml)
	})

	app.Get("/health-check", func(c *fiber.Ctx) error {
		c.Status(http.StatusOK)
		return c.SendString("Ok")
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
			"POST::/api/clips/scrape",
			"GET::/setting",
			"POST::/api/youtube/transcript",
			"POST::/api/youtube/channels",
			"GET::/api/youtube/video",
			"GET::/tools/*",
			"GET::/assets/*",
			"GET::/health-check",
			"GET::/tools/business-analysis",
			"GET::/explore-rss",
			"GET::/api/rss/github/languages",
			"POST::/api/convert/html",
			"POST::/api/proxy/*",
		},
		ErrorHandler: firebase.ErrorHandler,
	}))

	userRepo := user.NewUserRepository(db)
	tagRepo := tag.NewTagRepository(db)
	clip.NewClipHandler(app.Group("/api/clips"), clip.NewClipRepository(db), userRepo, tagRepo)
	wiki.NewWikiHandler(app.Group("/api/wikis"), wiki.NewWikiRepository(db), userRepo)
	tag.NewTagHandler(app.Group("/api/tags"), tagRepo, userRepo)
	user.NewUserHandler(app.Group("/api/users"), userRepo)
	bookmark.NewBookmarkHandler(app.Group("/api/bookmarks"))

	feed.NewFeedHandler(app.Group("/api/rss"), feed.NewFeedRepository(db), userRepo)
	api.NewYoutubeHandler(app.Group("/api/youtube"))
	api.NewRedditHandler(app.Group("/api/reddit"))
	api.NewConvertHtmlHandler(app.Group("/api/convert"))
	api.NewOpenAIHandler(app.Group("/api/proxy"))

	app.Listen(":" + env.Port)
}
