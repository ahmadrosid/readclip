package str

import (
	"io"
	"strings"

	"golang.org/x/net/html"
)

func TrimTo(source string, index int) string {
	if len(source) < index {
		return source
	}

	return source[:index]
}

func ReaderToHtmlNode(reader io.Reader) (*html.Node, error) {
	doc, err := html.Parse(reader)
	if err != nil {
		return nil, err
	}

	return doc, nil
}

func StringToHtmlNode(source string) (*html.Node, error) {
	return ReaderToHtmlNode(strings.NewReader(source))
}
