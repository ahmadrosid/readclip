package str_test

import (
	"testing"

	"github.com/ahmadrosid/readclip/internal/util/str"
)

func TestTrimTo(t *testing.T) {
	data := "Hello, where are you coming from when you're not working with the people you like?"
	result := str.TrimTo(data, 5)
	if result != "Hello" {
		t.Errorf("expected %s, got %s", "Hello,", result)
	}
}
