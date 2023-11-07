package util

import (
	"io"

	"golang.org/x/net/html"
)

type Bookmark struct {
	Title string
	URL   string
}

func filterBookmarks(bookmarks []Bookmark) []Bookmark {
	var filteredBookmarks []Bookmark
	for _, b := range bookmarks {
		if IsValidURL(b.URL) && !IsLocalhost(b.URL) {
			filteredBookmarks = append(filteredBookmarks, b)
		}
	}
	return filteredBookmarks
}

func ParseBookmarks(fileReader io.Reader) ([]Bookmark, error) {
	doc, err := html.Parse(fileReader)
	if err != nil {
		return nil, err
	}

	var bookmarks []Bookmark

	var f func(*html.Node)
	f = func(n *html.Node) {
		if n.Type == html.ElementNode && n.Data == "a" {
			var b Bookmark
			for _, a := range n.Attr {
				if a.Key == "href" {
					title := extractTitle(n)
					if title == "" {
						continue
					}
					b.Title = title
					b.URL = a.Val
					bookmarks = append(bookmarks, b)
				}
			}
		}
		for c := n.FirstChild; c != nil; c = c.NextSibling {
			f(c)
		}
	}

	f(doc)

	return filterBookmarks(bookmarks), nil
}

func extractTitle(n *html.Node) string {
	if n.Type == html.TextNode {
		return n.Data
	}
	for c := n.FirstChild; c != nil; c = c.NextSibling {
		title := extractTitle(c)
		if title != "" {
			return title
		}
	}
	return ""
}
