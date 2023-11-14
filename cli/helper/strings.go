package main

import "github.com/ahmadrosid/readclip/internal/util/str"

func main() {
	data := "Hello, where are you coming from when you're not working with the people you like?"
	println(str.TrimTo(data, 70))
}
