package main

import (
	"context"
	"io/fs"

	gofiberfirebaseauth "github.com/sacsand/gofiber-firebaseauth"

	"github.com/ahmadrosid/readclip/internal/api"
	"github.com/ahmadrosid/readclip/internal/bookmark"
	"github.com/ahmadrosid/readclip/internal/clip"
	"github.com/ahmadrosid/readclip/internal/static"
	"github.com/ahmadrosid/readclip/internal/tag"
	"github.com/ahmadrosid/readclip/internal/user"
	"github.com/ahmadrosid/readclip/internal/util"
	"github.com/ahmadrosid/readclip/internal/util/config"
	"github.com/ahmadrosid/readclip/internal/util/firebase"
	"github.com/ahmadrosid/readclip/ui"
	"github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
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

	static.HandleStatic(app, index)

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
	println("0.0.0.0:" + env.Port)
	app.Listen("0.0.0.0:" + env.Port)
}
