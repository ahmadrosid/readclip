package main

import (
	"fmt"
	"os"

	"github.com/ahmadrosid/readclip/internal/util"
)

func main() {
	filename := "/Users/ahmadrosid/Documents/bookmarks_9_3_23.html"
	file, err := os.Open(filename)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	bookmarks, err := util.ParseBookmarks(file)
	if err != nil {
		panic(err)
	}

	for _, b := range bookmarks {
		fmt.Println("Title:", b.Title)
		fmt.Println("URL:", b.URL)
		fmt.Println("------")
	}
}
