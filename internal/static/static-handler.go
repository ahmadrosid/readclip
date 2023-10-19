package static

import (
	"io/fs"
	"net/http"
	"strings"

	"github.com/ahmadrosid/readclip/internal/util/embedfile"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
)

func HandleStatic(app *fiber.App, index fs.FS) {
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

		return c.Type("html").SendString(newHtml)
	})

}
