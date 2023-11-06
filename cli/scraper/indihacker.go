package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/go-shiori/dom"
	"golang.org/x/net/html"
)

func parseHTMLSource(htmlSource string) (*html.Node, error) {
	doc, err := html.Parse(strings.NewReader(htmlSource))
	if err != nil {
		return nil, err
	}

	body := dom.QuerySelector(doc, ".featured")
	return body, nil
}

func main() {
	filePath := "./cli/scraper/html/hacker.html"
	content, err := os.ReadFile(filePath)
	if err != nil {
		fmt.Printf("Error reading file: %v\n", err)
		return
	}

	htmlContent := string(content)

	doc, err := parseHTMLSource(htmlContent)
	if err != nil {
		log.Fatal(err)
	}

	type DataItem struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		Link        string `json:"link"`
		Image       string `json:"image"`
		Author      string `json:"author"`
	}

	var items []DataItem

	for _, item := range dom.QuerySelectorAll(doc, ".story") {
		title := dom.QuerySelector(item, ".story__title")
		description := dom.QuerySelector(item, ".story__summary")
		thumbnail := dom.QuerySelector(item, ".img-lazy--loaded")
		link := dom.QuerySelector(item, ".story__link-element")
		author := dom.QuerySelector(item, ".user-link__name--username")
		url := dom.GetAttribute(link, "href")

		items = append(items, DataItem{
			Title:       dom.InnerText(title),
			Description: dom.InnerText(description),
			Link:        fmt.Sprintf("https://www.indiehackers.com%s", url),
			Image:       dom.GetAttribute(thumbnail, "src"),
			Author:      dom.InnerText(author),
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
