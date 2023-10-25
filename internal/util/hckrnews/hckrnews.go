package hckrnews

import (
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"

	"github.com/ahmadrosid/readclip/internal/util"
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

	body := dom.QuerySelector(doc, "body")
	return body, nil
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

		// parse user name to string
		hnuserDom := dom.QuerySelector(subtextDom, ".hnuser")
		if hnuserDom != nil {
			dataItem.Author = dom.InnerText(hnuserDom)
		}

		// parse user name to string
		ageDom := dom.QuerySelector(subtextDom, ".age")
		if ageDom != nil {
			dataItem.Date = dom.GetAttribute(ageDom, "title")
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

		result = append(result, dataItem)
	}

	return result
}

func FetchHackernews() (interface{}, error) {
	req, err := http.NewRequest("GET", "https://news.ycombinator.com/", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", " */*")
	req.Header.Set("User-Agent", util.UserAgent)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("HTTP request failed with status code: %d", resp.StatusCode)
	}

	htmlContent, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("HTTP request failed with status code: %d", resp.StatusCode)
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

	return feedResult, nil
}
