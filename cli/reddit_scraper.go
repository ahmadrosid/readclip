package main

import (
	"fmt"

	"github.com/ahmadrosid/readclip/internal/scraper/reddit"
)

func main() {
	resp, err := reddit.GetSubreddit("nextjs")
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	fmt.Printf("%v", resp)
}
