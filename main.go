package main

import (
	"context"
	"io/fs"
	"net/http"

	gofiberfirebaseauth "github.com/sacsand/gofiber-firebaseauth"

	"github.com/ahmadrosid/readclip/internal/bookmark"
	"github.com/ahmadrosid/readclip/internal/clip"
	"github.com/ahmadrosid/readclip/internal/tag"
	"github.com/ahmadrosid/readclip/internal/user"
	"github.com/ahmadrosid/readclip/internal/util"
	"github.com/ahmadrosid/readclip/internal/util/config"
	"github.com/ahmadrosid/readclip/internal/util/firebase"
	"github.com/ahmadrosid/readclip/internal/youtube"
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

	app.Get("/clip", serveUI)
	app.Get("/register", serveUI)
	app.Get("/clips", serveUI)
	app.Get("/setting", serveUI)
	app.Get("/login", serveUI)
	app.Get("/tools", serveUI)
	app.Get("/tools/word-counter", serveUI)
	app.Get("/tools/reading-time", serveUI)

	app.Use("/", filesystem.New(filesystem.Config{
		Root:   http.FS(index),
		Index:  "index.html",
		Browse: false,
	}))

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
			"GET::/tools/*",
			"POST::/api/youtube/transcript",
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
	youtube.NewHandler(
		app.Group("/api/youtube"),
	)
	user.NewHandler(
		app.Group("/api/users"),
		userRepo,
	)
	app.Listen(":" + env.Port)
}
