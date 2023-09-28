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
	db, _ := util.ConnectToDatabase(env.DatabaseUrl)
	app := fiber.New(fiber.Config{
		JSONEncoder: json.Marshal,
		JSONDecoder: json.Unmarshal,
	})
	app.Use(recover.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000, http://127.0.0.1:8000",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	index, err := fs.Sub(ui.Index, "dist")
	if err != nil {
		panic(err)
	}

	serveUI := filesystem.New(filesystem.Config{
		Root:  http.FS(index),
		Index: "index.html",
	})

	app.Use("/login", serveUI)
	app.Use("/register", serveUI)
	app.Use("/clips", serveUI)
	app.Use("/setting", serveUI)
	app.Use("/", serveUI)

	ctx := context.Background()
	firebaseApp, err := firebase.NewFirebaseApp(ctx, env)
	if err != nil {
		panic(err)
	}

	app.Use(gofiberfirebaseauth.New(gofiberfirebaseauth.Config{
		FirebaseApp:  firebaseApp,
		IgnoreUrls:   []string{"GET::/login", "GET::/register"},
		ErrorHandler: firebase.ErrorHandler,
	}))

	clip.NewHandler(
		app.Group("/api/clips"),
		clip.NewClipRepository(db),
	)
	tag.NewHandler(
		app.Group("/api/tags"),
		tag.NewTagRepository(db),
	)
	bookmark.NewHandler(
		app.Group("/api/bookmarks"),
	)
	user.NewHandler(
		app.Group("/api/users"),
		user.NewUserRepository(db),
	)

	app.Listen(":" + env.Port)
}
