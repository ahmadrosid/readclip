package hckrnews

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/ahmadrosid/readclip/internal/util"
	"github.com/ahmadrosid/readclip/internal/util/fetch"
	"github.com/go-shiori/dom"
	"golang.org/x/net/html"
)

type HackernewsResponse struct {
	Title    string `json:"title"`
	Link     string `json:"link"`
	Source   string `json:"source"`
	Author   string `json:"author"`
	Points   int    `json:"points"`
	Comments int    `json:"comments"`
	Date     string `json:"date"`
}

func parseHTMLSource(htmlSource string) (*html.Node, error) {
	doc, err := html.Parse(strings.NewReader(htmlSource))
	if err != nil {
		return nil, err
	}
	return doc, nil
}

func parseContent(content string) []HackernewsResponse {
	var result = make([]HackernewsResponse, 0)
	doc, err := parseHTMLSource(content)
	if err != nil {
		println("Parse error")
		return result
	}

	if doc == nil {
		println("Doc is nil")
		return result
	}

	for _, item := range dom.QuerySelectorAll(doc, ".athing") {
		// Parse title and link
		titleNode := dom.QuerySelector(item, ".titleline")
		titleEl := dom.QuerySelector(titleNode, "a")
		var dataItem HackernewsResponse = HackernewsResponse{
			Title: dom.InnerText(titleEl),
			Link:  dom.GetAttribute(titleEl, "href"),
		}

		// parse source link
		sitestrEl := dom.QuerySelector(titleNode, ".sitestr")
		if sitestrEl != nil {
			dataItem.Source = dom.InnerText(sitestrEl)
		}

		next := dom.NextElementSibling(item)
		subtextDom := dom.QuerySelector(next, ".subtext")

		// Parse score value to int
		scoreDom := dom.QuerySelector(subtextDom, ".score")
		if scoreDom != nil {
			pointLabel := " points"
			scoreText := dom.InnerText(scoreDom)
			points, _ := strconv.Atoi(scoreText[:len(scoreText)-len(pointLabel)])
			dataItem.Points = points
		}

		// parse author name to string
		hnuserDom := dom.QuerySelector(subtextDom, ".hnuser")
		if hnuserDom != nil {
			dataItem.Author = dom.InnerText(hnuserDom)
		}

		// parse date to string
		ageDom := dom.QuerySelector(subtextDom, ".age")
		if ageDom != nil {
			dataItem.Date = dom.GetAttribute(ageDom, "title")
		}

		subtextDomChildren := dom.QuerySelectorAll(subtextDom, "a")
		if len(subtextDomChildren) > 0 {
			lastEl := subtextDomChildren[len(subtextDomChildren)-1]
			if comments, err := strconv.Atoi(strings.TrimSuffix(dom.InnerText(lastEl), " comments")); err == nil {
				dataItem.Comments = comments
			}
		}

		result = append(result, dataItem)
	}

	return result
}

func FetchHackernews() (*util.FeedResult, error) {
	htmlContent, err := fetch.Fetch("https://news.ycombinator.com")
	if err != nil {
		return nil, err
	}

	var response = parseContent(string(htmlContent))
	if len(response) == 0 {
		return nil, fmt.Errorf("data not found")
	}

	feedResult := util.FeedResult{
		Title:       "Hackernews",
		Description: "Hackernews top page",
		Link:        "https://news.ycombinator.com",
		Items:       make([]util.FeedItem, 0),
	}

	for _, item := range response {
		feedItem := util.FeedItem{
			Title:       item.Title,
			Description: fmt.Sprintf("<p class=\"text-gray-500\">%s</p>", item.Link),
			Link:        item.Link,
			Author:      item.Author,
			Date:        item.Date,
		}
		feedResult.Items = append(feedResult.Items, feedItem)
	}

	return &feedResult, nil
}
