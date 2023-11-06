package producthunt

import (
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/ahmadrosid/readclip/internal/util"
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

func fetchProductHunt() (string, error) {
	req, err := http.NewRequest("GET", "https://producthunt.com", nil)
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

func ParseHomePage() (*util.FeedResult, error) {
	var items []ProducthuntResponse

	htmlSource, err := fetchProductHunt()
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
