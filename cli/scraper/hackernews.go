package main

import (
	"fmt"
	"log"
	"strconv"
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
	htmlContent, err := fetch.Fetch("https://news.ycombinator.com/")
	if err != nil {
		fmt.Printf("Error reading file: %v\n", err)
		return
	}

	doc, err := parseHTMLSource(htmlContent)
	if err != nil {
		log.Fatal(err)
	}

	type DataItem struct {
		Title    string `json:"title"`
		Link     string `json:"link"`
		Source   string `json:"source"`
		Author   string `json:"author"`
		Points   int    `json:"points"`
		Comments int    `json:"comments"`
		Date     string `json:"date"`
	}

	for _, item := range dom.QuerySelectorAll(doc, ".athing") {
		// Parse title and link
		title := dom.QuerySelector(item, ".titleline")
		titleEl := dom.QuerySelector(title, "a")
		sitestrEl := dom.QuerySelector(title, ".sitestr")
		Source := ""
		if sitestrEl != nil {
			Source = dom.InnerText(sitestrEl)
		}

		var dataItem DataItem = DataItem{
			Title:  dom.InnerText(titleEl),
			Source: Source,
			Link:   dom.GetAttribute(titleEl, "href"),
		}

		next := dom.NextElementSibling(item)
		if next == nil {
			continue
		}
		subtextDom := dom.QuerySelector(next, ".subtext")

		// Parse score value to int
		scoreDom := dom.QuerySelector(subtextDom, ".score")
		if scoreDom != nil {
			pointLabel := " points"
			scoreText := dom.InnerText(scoreDom)
			points, _ := strconv.Atoi(scoreText[:len(scoreText)-len(pointLabel)])
			dataItem.Points = points
		}

		// parse user name to string
		hnuserDom := dom.QuerySelector(subtextDom, ".hnuser")
		if hnuserDom != nil {
			dataItem.Author = dom.InnerText(hnuserDom)
		}

		// parse user name to string
		ageDom := dom.QuerySelector(subtextDom, ".age")
		if ageDom != nil {
			dataItem.Author = dom.GetAttribute(ageDom, "title")
		}

		// parse comments
		subtextDomChildren := dom.QuerySelectorAll(subtextDom, "a")
		if len(subtextDomChildren) > 0 {
			lastEl := subtextDomChildren[len(subtextDomChildren)-1]
			commentLabel := " comments"
			commnetText := dom.InnerText(lastEl)

			if strings.HasSuffix(commnetText, commentLabel) {
				comments, _ := strconv.Atoi(commnetText[:len(commnetText)-len(commentLabel)])
				dataItem.Comments = comments
			}
		}

		fmt.Printf("%v\n\n", dataItem)
	}

}
