package indihacker

import (
	"fmt"
	"strings"

	"github.com/ahmadrosid/readclip/internal/util"
	"github.com/ahmadrosid/readclip/internal/util/fetch"
	"github.com/go-shiori/dom"
	"golang.org/x/net/html"
)

type IndihackerResponse struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Link        string `json:"link"`
	Image       string `json:"image"`
	Author      string `json:"author"`
}

func FetchIndihacker(option string) (*util.FeedResult, error) {
	if option == "featured" {
		return ParseFeatured()
	}

	return ParseLatest()
}

func ParseLatest() (*util.FeedResult, error) {
	var items []IndihackerResponse

	htmlSource, err := fetch.Fetch("https://www.indiehackers.com/")
	if err != nil {
		return nil, err
	}

	doc, err := html.Parse(strings.NewReader(htmlSource))
	if err != nil {
		return nil, err
	}

	body := dom.QuerySelector(doc, ".newest__content")
	for _, item := range dom.QuerySelectorAll(body, ".story") {
		title := dom.QuerySelector(item, ".story__title")
		description := dom.QuerySelector(item, ".story__time-ago")
		thumbnail := dom.QuerySelector(item, ".img-lazy--loaded")
		link := dom.QuerySelector(item, ".story__link-element")
		author := dom.QuerySelector(item, ".user-link__name--username")
		url := dom.GetAttribute(link, "href")

		img := ""

		if thumbnail != nil {
			img = dom.GetAttribute(thumbnail, "src")
		}

		author_name := ""
		if author != nil {
			author_name = dom.InnerText(author)
		}

		items = append(items, IndihackerResponse{
			Title:       dom.InnerText(title),
			Description: dom.InnerText(description),
			Link:        fmt.Sprintf("https://www.indiehackers.com%s", url),
			Image:       img,
			Author:      author_name,
		})
	}

	feedResult := util.FeedResult{
		Title:       "Indiehackers - latest news",
		Description: "Indiehackers latest news",
		Link:        "https://indiehackers.com",
		Items:       make([]util.FeedItem, 0),
	}

	for _, item := range items {
		feedItem := util.FeedItem{
			Title:       item.Title,
			Description: fmt.Sprintf("<p class=\"text-gray-500\">%s</p>", item.Description),
			Link:        item.Link,
			Author:      item.Author,
		}
		feedResult.Items = append(feedResult.Items, feedItem)
	}

	return &feedResult, nil
}

func ParseFeatured() (*util.FeedResult, error) {
	var items []IndihackerResponse

	htmlSource, err := fetch.Fetch("https://www.indiehackers.com/")
	if err != nil {
		return nil, err
	}

	doc, err := html.Parse(strings.NewReader(htmlSource))
	if err != nil {
		return nil, err
	}

	body := dom.QuerySelector(doc, ".featured")
	for _, item := range dom.QuerySelectorAll(body, ".story") {
		title := dom.QuerySelector(item, ".story__title")
		description := dom.QuerySelector(item, ".story__summary")
		thumbnail := dom.QuerySelector(item, ".img-lazy--loaded")
		link := dom.QuerySelector(item, ".story__link-element")
		author := dom.QuerySelector(item, ".user-link__name--username")
		url := dom.GetAttribute(link, "href")

		img := ""

		if thumbnail != nil {
			img = dom.GetAttribute(thumbnail, "src")
		}

		items = append(items, IndihackerResponse{
			Title:       dom.InnerText(title),
			Description: dom.InnerText(description),
			Link:        fmt.Sprintf("https://www.indiehackers.com%s", url),
			Image:       img,
			Author:      dom.InnerText(author),
		})
	}

	feedResult := util.FeedResult{
		Title:       "Indiehackers - featured",
		Description: "Indiehackers front page",
		Link:        "https://indiehackers.com",
		Items:       make([]util.FeedItem, 0),
	}

	for _, item := range items {
		feedItem := util.FeedItem{
			Title:       item.Title,
			Description: fmt.Sprintf("<p class=\"text-gray-500\">%s</p>", item.Description),
			Link:        item.Link,
			Author:      item.Author,
		}
		feedResult.Items = append(feedResult.Items, feedItem)
	}

	return &feedResult, nil
}
