package fetch

import (
	"io"
	"net/http"

	"github.com/ahmadrosid/readclip/internal/util"
)

func Fetch(path string) (string, error) {
	req, err := http.Get(path)
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", " */*")
	req.Header.Set("User-Agent", util.UserAgent)

	body, err := io.ReadAll(req.Body)
	if err != nil {
		return "", err
	}

	return string(body), nil
}
