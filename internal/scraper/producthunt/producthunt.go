package producthunt

import (
	"fmt"
	"strings"

	"github.com/ahmadrosid/readclip/internal/util"
	"github.com/ahmadrosid/readclip/internal/util/fetch"
	"github.com/go-shiori/dom"
	"golang.org/x/net/html"
)

type ProducthuntResponse struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Link        string `json:"link"`
	Image       string `json:"image"`
	Vote        string `json:"vote"`
}

func ParseHomePage() (*util.FeedResult, error) {
	var items []ProducthuntResponse

	htmlSource, err := fetch.Fetch("https://producthunt.com")
	if err != nil {
		return nil, err
	}

	body, err := html.Parse(strings.NewReader(htmlSource))
	if err != nil {
		return nil, err
	}

	doc := dom.QuerySelector(body, `[data-test="homepage-section-0"]`)

	for _, item := range dom.Children(doc) {
		link := dom.QuerySelector(item, "a")
		if link == nil {
			continue
		}
		url := dom.GetAttribute(link, "href")
		if url == "/sponsor" {
			continue
		}

		title := dom.GetAttribute(link, "aria-label")
		if title == "" {
			continue
		}

		thumbnail := dom.QuerySelector(item, "img")
		if thumbnail == nil {
			continue
		}

		vote := dom.QuerySelector(item, "[data-test=\"vote-button\"]")
		if vote == nil {
			continue
		}

		links := dom.QuerySelectorAll(item, "a")
		if len(links) < 3 {
			continue
		}

		description := dom.InnerText(links[3])

		items = append(items, ProducthuntResponse{
			Title:       title,
			Description: description,
			Link:        fmt.Sprintf("https://producthunt.com%s", url),
			Image:       dom.GetAttribute(thumbnail, "src"),
			Vote:        dom.InnerText(vote),
		})
	}

	feedResult := util.FeedResult{
		Title:       "Producthunt",
		Description: "Producthunt latest launch",
		Link:        "https://producthunt.com/",
		Items:       make([]util.FeedItem, 0),
	}

	for _, item := range items {
		feedItem := util.FeedItem{
			Title:       item.Title,
			Description: fmt.Sprintf("<p class=\"text-gray-500\">%s</p>", item.Description),
			Link:        item.Link,
			Metadata: util.FeedMetadata{
				Vote: item.Vote,
			},
		}
		feedResult.Items = append(feedResult.Items, feedItem)
	}

	return &feedResult, nil
}
