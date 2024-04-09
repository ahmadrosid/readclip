package main

import (
	"fmt"
	"os"
	"strings"
)

func readFileFromPath(path string) string {
	// read file into a text
	data, err := os.ReadFile(path)
	if err != nil {
		panic(err)
	}
	// convert bytes to string
	return string(data)
}

func main() {
	path := "cli/data/long-test.md"
	content := readFileFromPath(path)
	// fmt.Println(strings.Count(content, " "))
	splits := strings.Split(content, " ")
	trimmed := strings.Join(splits[0:2500], " ")
	fmt.Println(trimmed)
}
