package main

import (
	"fmt"
	"strings"

	"github.com/ahmadrosid/readclip/internal/util/fetch"
	"github.com/go-shiori/dom"
	"golang.org/x/net/html"
)

func main() {
	htmlContent, err := fetch.Fetch("https://www.producthunt.com/")
	if err != nil {
		fmt.Printf("Error reading file: %v\n", err)
		return
	}

	body, err := html.Parse(strings.NewReader(htmlContent))
	if err != nil {
		fmt.Printf("Error reading file: %v\n", err)
		return
	}

	doc := dom.QuerySelector(body, `[data-test="homepage-section-0"]`)

	type DataItem struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		Link        string `json:"link"`
		Image       string `json:"image"`
		Vote        string `json:"vote"`
	}

	var items []DataItem = make([]DataItem, 0)

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
		dataItem := DataItem{
			Title:       title,
			Description: description,
			Link:        fmt.Sprintf("https://producthunt.com%s", url),
			Image:       dom.GetAttribute(thumbnail, "src"),
			Vote:        dom.InnerText(vote),
		}

		items = append(items, dataItem)
		fmt.Printf("%v\n", dataItem)
	}

}
