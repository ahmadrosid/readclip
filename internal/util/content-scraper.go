package util

import (
	"fmt"
	"net/http"
	nurl "net/url"
	"regexp"
	"strings"
	"time"

	"github.com/ahmadrosid/readclip/internal/util/str"
	"github.com/go-shiori/dom"
	"github.com/markusmobius/go-trafilatura"
)

var (
	httpClient = &http.Client{
		Timeout: 30 * time.Second,
	}
	imgRegex = regexp.MustCompile(`<img\s+src="(.+?)"`)
	ua       = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"
)

func Scrape(url string, format string) (*ContentData, error) {
	parsedURL, err := nurl.ParseRequestURI(url)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("User-Agent", ua)
	resp, err := httpClient.Do(req)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	opts := trafilatura.Options{
		IncludeImages: true,
		OriginalURL:   parsedURL,
	}

	result, err := trafilatura.Extract(resp.Body, opts)
	if err != nil {
		fmt.Printf("failed to extract: %v", err)
		return nil, err
	}

	doc := trafilatura.CreateReadableDocument(result)

	var textResult string
	// Parse title
	var title = result.Metadata.Title
	htmlNode, err := str.ReaderToHtmlNode(resp.Body)
	if err == nil {
		titleNode := dom.GetElementsByTagName(htmlNode, "title")
		if len(titleNode) > 0 {
			title = dom.InnerText(titleNode[0])
		}
	}

	if format == "text" {
		textResult = dom.InnerText(doc)
	} else if format == "html" {
		textResult = dom.OuterHTML(doc)
	} else if format == "markdown" {
		renderHtml := dom.OuterHTML(doc)
		renderHtml = fixImageURL(renderHtml, getBaseURL(url))
		markdown, err := ConvertHtmlToMarkdown(renderHtml)
		if err != nil {
			return nil, err
		}
		textResult = markdown
	}

	if len(textResult) > 0 && textResult[0] == '#' {
		textResult = textResult[strings.Index(textResult, "\n")+1:]
	}

	var Description = result.Metadata.Description

	if Description == "" {
		Description = str.TrimTo(textResult, 70)
	}

	return &ContentData{
		Url:     url,
		Title:   title,
		Content: textResult,
		Metadata: &Metadata{
			Title:       result.Metadata.Title,
			Author:      result.Metadata.Author,
			URL:         result.Metadata.URL,
			Hostname:    result.Metadata.Hostname,
			Description: Description,
			Sitename:    result.Metadata.Sitename,
			Date:        result.Metadata.Date,
			Categories:  result.Metadata.Categories,
			Tags:        result.Metadata.Tags,
			ID:          result.Metadata.ID,
			Fingerprint: result.Metadata.Fingerprint,
			License:     result.Metadata.License,
			Language:    result.Metadata.Language,
			Image:       result.Metadata.Image,
			PageType:    result.Metadata.PageType,
		},
	}, nil
}

func getBaseURL(rawURL string) string {
	url, err := nurl.Parse(rawURL)
	if err != nil {
		return ""
	}
	url.Path = ""
	if !strings.HasSuffix(url.String(), "/") {
		url.Path += "/"
	}

	return url.String()
}

func fixImageURL(html string, baseURL string) string {
	return imgRegex.ReplaceAllStringFunc(html, func(imgTag string) string {
		url := imgRegex.FindStringSubmatch(imgTag)[1]
		if strings.HasPrefix(url, "http://") || strings.HasPrefix(url, "https://") {
			return imgTag
		}

		if strings.HasPrefix(url, "//") {
			return strings.Replace(imgTag, url, "https:"+url, 1)
		}

		return strings.Replace(imgTag, url, baseURL+url, 1)
	})
}
