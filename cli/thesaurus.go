package main

import (
	"fmt"

	"github.com/ahmadrosid/readclip/internal/util/thesaurus"
)

func main() {
	data, err := thesaurus.ParseWordData()

	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println(data[1].Key)
}
