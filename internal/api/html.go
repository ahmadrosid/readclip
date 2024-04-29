package api

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/ahmadrosid/readclip/internal/util"
	"github.com/ahmadrosid/readclip/internal/util/str"
	"github.com/go-shiori/dom"
	"github.com/gofiber/fiber/v2"
	"github.com/markusmobius/go-trafilatura"
)

type HtmlRequest struct {
	HtmlText string `json:"html_text"`
}

type htmlHandler struct{}

func NewConvertHtmlHandler(route fiber.Router) *htmlHandler {
	handler := &htmlHandler{}
	route.Post("/html", handler.convertHtmlToMarkdown)
	return handler
}

func (h *htmlHandler) convertHtmlToMarkdown(c *fiber.Ctx) error {
	var input HtmlRequest
	if err := c.BodyParser(&input); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"status": "error",
			"error":  err.Error(),
		})
	}

	opts := trafilatura.Options{
		IncludeImages: true,
		IncludeLinks:  true,
	}

	reader := strings.NewReader(input.HtmlText)
	result, err := trafilatura.Extract(reader, opts)
	if err != nil {
		fmt.Printf("failed to extract: %v", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"status": "error",
			"error":  err.Error(),
		})
	}

	doc := trafilatura.CreateReadableDocument(result)
	renderHtml := dom.OuterHTML(doc)

	// Parse title
	title := result.Metadata.Title
	htmlNode, err := str.StringToHtmlNode(input.HtmlText)
	if err == nil {
		titleNode := dom.GetElementsByTagName(htmlNode, "title")
		if len(titleNode) > 0 {
			title = dom.InnerText(titleNode[0])
		}
	}

	markdown, err := util.ConvertHtmlToMarkdown(renderHtml)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"status": "error",
			"error":  err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"title":   title,
			"content": markdown,
		},
	})
}
