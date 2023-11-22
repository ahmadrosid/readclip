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

	// fmt.Printf("Media: %v", resp.Data.Children[0].Data.Media)

	for idx, item := range resp.Data.Children {
		if idx != 17 {
			continue
		}
		fmt.Println("\n")
		// fmt.Printf("%d. %v\n", idx, item.Data.Title)
		// fmt.Printf("%d. %v\n", idx, item.Data.SubredditNamePrefixed)
		// fmt.Printf("%d. %v\n", idx, fmt.Sprintf("https://reddit.com%s", item.Data.Permalink))
		// fmt.Printf("%d. %v\n", idx, item.Data.Thumbnail)
		// fmt.Printf("%d. %v...\n", idx, fmt.Sprintf("%.120s...", item.Data.Selftext))

		if item.Data.Thumbnail != "self" {
			render := fmt.Sprintf(
				`<div><p>%s</p><div class="flex gap-2"><img src="%s" alt="source" class="aspect-square object-cover rounded-md border" /><p>%.120s...</p></div></div>`,
				item.Data.SubredditNamePrefixed,
				item.Data.Thumbnail,
				item.Data.Selftext,
			)
			fmt.Println(render)
		} else {
			render := fmt.Sprintf(
				`<div><p>%s</p><p>%.120s...</p></div>`,
				item.Data.SubredditNamePrefixed,
				item.Data.Selftext,
			)
			fmt.Println(render)
		}
	}
}
