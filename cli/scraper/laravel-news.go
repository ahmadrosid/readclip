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
	filePath := "./cli/scraper/laravelnews.html"
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

	sections := dom.QuerySelectorAll(body, "section")
	doc := sections[1]

	type DataItem struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		Link        string `json:"link"`
		Image       string `json:"image"`
		Author      string `json:"author"`
	}

	var items []DataItem

	for _, item := range dom.QuerySelectorAll(doc, ".group") {
		title := dom.QuerySelector(item, "h3")
		description := dom.QuerySelector(item, "p")
		thumbnail := dom.QuerySelector(item, "img")
		link := dom.QuerySelector(item, "a")
		url := dom.GetAttribute(link, "href")
		if url == "/advertising" {
			continue
		}

		items = append(items, DataItem{
			Title:       dom.InnerText(title),
			Description: dom.InnerText(description),
			Link:        fmt.Sprintf("https://www.indiehackers.com%s", url),
			Image:       dom.GetAttribute(thumbnail, "src"),
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
