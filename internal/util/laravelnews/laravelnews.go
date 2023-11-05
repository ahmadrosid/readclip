package laravelnews

import (
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/ahmadrosid/readclip/internal/util"
	"github.com/go-shiori/dom"
	"golang.org/x/net/html"
)

type LaravelnewsResponse struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Link        string `json:"link"`
	Image       string `json:"image"`
	Author      string `json:"author"`
}

func fetchLaravelnews() (string, error) {
	req, err := http.NewRequest("GET", "https://laravel-news.com/blog", nil)
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", " */*")
	req.Header.Set("User-Agent", util.UserAgent)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("HTTP request failed with status code: %d", resp.StatusCode)
	}

	htmlContent, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("HTTP request failed with status code: %d", resp.StatusCode)
	}

	return string(htmlContent), nil

}

func ParseBlogPage() (*util.FeedResult, error) {
	var items []LaravelnewsResponse

	htmlSource, err := fetchLaravelnews()
	if err != nil {
		return nil, err
	}

	body, err := html.Parse(strings.NewReader(htmlSource))
	if err != nil {
		return nil, err
	}

	sections := dom.QuerySelectorAll(body, "section")
	if len(sections) != 3 {
		return nil, fmt.Errorf("sections only return %d", len(sections))
	}

	doc := sections[1]

	for _, item := range dom.QuerySelectorAll(doc, ".group") {
		title := dom.QuerySelector(item, "h3")
		description := dom.QuerySelector(item, "p")
		thumbnail := dom.QuerySelector(item, "img")
		link := dom.QuerySelector(item, "a")
		url := dom.GetAttribute(link, "href")
		if url == "/advertising" {
			continue
		}

		items = append(items, LaravelnewsResponse{
			Title:       dom.InnerText(title),
			Description: dom.InnerText(description),
			Link:        url,
			Image:       dom.GetAttribute(thumbnail, "src"),
		})
	}

	feedResult := util.FeedResult{
		Title:       "Laravelnews - latest blog",
		Description: "Laravelnews latest blog",
		Link:        "https://laravel-news.com/",
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
