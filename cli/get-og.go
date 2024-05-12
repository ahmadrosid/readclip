package main

import (
	"fmt"
	"log"
	"strings"

	"github.com/ahmadrosid/readclip/internal/util/fetch"
	"github.com/go-shiori/dom"
	"golang.org/x/net/html"
)

func parseHTMLSource(htmlSource string) (*html.Node, error) {
	doc, err := html.Parse(strings.NewReader(htmlSource))
	if err != nil {
		return nil, err
	}

	body := dom.GetElementsByTagName(doc, "body")[0]
	return body, nil
}

func main() {
	url := "https://overengineer.dev/blog/2024/05/10/thread/"
	htmlContent, err := fetch.Fetch(url)
	if err != nil {
		fmt.Printf("Error fetching URL: %v\n", err)
		return
	}

	doc, err := parseHTMLSource(htmlContent)
	if err != nil {
		log.Fatal(err)
	}

	// Extract title
	titleNode := dom.QuerySelector(doc, "title")
	title := ""
	if titleNode == nil {
		metaTitleNode := dom.QuerySelector(doc, "meta[name='description']")
		titleNode := dom.GetAttribute(metaTitleNode, "content")
		title = titleNode
	} else {
		title = dom.InnerText(titleNode)
	}

	// Extract meta description
	metaDescNode := dom.QuerySelector(doc, "meta[name='description']")
	metaDesc := dom.GetAttribute(metaDescNode, "content")

	// Extract Open Graph (OG) image
	ogImageNode := dom.QuerySelector(doc, "meta[property='og:image']")
	ogImage := dom.GetAttribute(ogImageNode, "content")

	fmt.Println("Title:", title)
	fmt.Println("Meta Description:", metaDesc)
	fmt.Println("OG Image:", ogImage)
}
