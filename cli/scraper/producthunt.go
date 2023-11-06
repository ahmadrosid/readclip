package main

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"github.com/go-shiori/dom"
	"golang.org/x/net/html"
)

func main() {
	filePath := "./cli/scraper/html/producthunt.html"
	content, err := os.ReadFile(filePath)
	if err != nil {
		fmt.Printf("Error reading file: %v\n", err)
		return
	}

	htmlContent := string(content)

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

	var items []DataItem

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

		items = append(items, DataItem{
			Title:       title,
			Description: description,
			Link:        fmt.Sprintf("https://producthunt.com%s", url),
			Image:       dom.GetAttribute(thumbnail, "src"),
			Vote:        dom.InnerText(vote),
		})
	}

	jsonData, err := json.Marshal(items)
	if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		return
	}

	jsonString := string(jsonData)
	fmt.Println(jsonString)

}
