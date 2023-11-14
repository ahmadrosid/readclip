package main

import (
	"fmt"
	"log"
	"strings"

	"github.com/ahmadrosid/readclip/internal/util/fetch"
	"github.com/go-shiori/dom"
	"golang.org/x/net/html"
)

func main() {
	htmlContent, err := fetch.Fetch("http://localhost:8000/")
	if err != nil {
		fmt.Printf("Error reading file: %v\n", err)
		return
	}

	doc, err := html.Parse(strings.NewReader(htmlContent))
	if err != nil {
		fmt.Printf("Error reading file: %v\n", err)
		return
	}

	if err != nil {
		log.Fatal(err)
	}

	var result = dom.QuerySelector(doc, "head")
	fmt.Println(dom.InnerHTML(result))

}
