package str

func TrimTo(source string, index int) string {
	if len(source) < index {
		return source
	}

	return source[:index]
}
