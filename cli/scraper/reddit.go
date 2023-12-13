package main

import (
	"fmt"

	"github.com/ahmadrosid/readclip/internal/scraper/reddit"
)

func main() {
	// jsonContent, err := fetch.Fetch("https://www.reddit.com/r/nextjs.json")
	// if err != nil {
	// 	fmt.Printf("Error reading file: %v\n", err)
	// 	return
	// }

	resp, err := reddit.GetSubreddit("nextjs")
	if err != nil {
		fmt.Printf("%w\n", err)
		return
	}
	fmt.Println(resp)
}
