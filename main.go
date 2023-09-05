package main

import (
	"io/fs"
	"net/http"
	"os"

	"github.com/ahmadrosid/readclip/internal/bookmark"
	"github.com/ahmadrosid/readclip/internal/clip"
	"github.com/ahmadrosid/readclip/internal/tag"
	"github.com/ahmadrosid/readclip/internal/util"
	"github.com/ahmadrosid/readclip/ui"
	"github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	godotenv.Load()
	connStr := os.Getenv("DB_CONNECTION_STRING")
	if connStr == "" {
		println("DB_CONNECTION_STRING is empty")
	}

	db, _ := util.ConnectToDatabase(connStr)
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

	app.Use("/clips", serveUI)
	app.Use("/setting", serveUI)
	app.Use("/", serveUI)

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

	app.Listen(":" + os.Getenv("PORT"))
}
