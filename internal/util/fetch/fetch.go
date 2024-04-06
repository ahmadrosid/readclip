package fetch

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"

	"github.com/ahmadrosid/readclip/internal/util"
)

type HTTPClient interface {
	Do(req *http.Request) (*http.Response, error)
}

var Client HTTPClient = &http.Client{}

func Fetch(path string) (string, error) {
	req, err := http.NewRequest("GET", path, nil)
	if err != nil {
		return "", err
	}

	req.Header.Add("Content-Type", "*/*")
	req.Header.Set("User-Agent", util.UserAgent)

	client := Client
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	return string(body), nil
}

func Post(path string, requestBody interface{}, authToken string) (string, error) {
	payloadBytes, err := json.Marshal(requestBody)
	if err != nil {
		return "", err
	}
	bodyPost := bytes.NewReader(payloadBytes)

	client := Client
	req, err := http.NewRequest("POST", path, bodyPost)
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", util.UserAgent)
	req.Header.Set("Authorization", "Bearer "+authToken)

	res, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return "", err
	}

	return string(body), nil
}
