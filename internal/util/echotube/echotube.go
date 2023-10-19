package echotube

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

type VideoInfo struct {
	ID               string `json:"id"`
	ChannelID        string `json:"channel_id"`
	Title            string `json:"title"`
	Duration         int    `json:"duration"`
	ShortDescription string `json:"short_description"`
	Author           string `json:"author"`
	Embed            struct {
		IfameURL string `json:"iframe_url"`
		Width    int    `json:"width"`
		Height   int    `json:"height"`
	} `json:"embed"`
	Channel struct {
		ID   string `json:"id"`
		Name string `json:"name"`
		URL  string `json:"url"`
	} `json:"channel"`
	Category string `json:"category"`
}

type Content struct {
	Text     string `json:"text"`
	Duration int    `json:"duration"`
	Offset   int    `json:"offset"`
}

type VideoData struct {
	Info     VideoInfo `json:"info"`
	URL      string    `json:"url"`
	Content  []Content `json:"content"`
	Language string    `json:"language"`
}

func GetTranscript(videoURL string) (*VideoData, error) {
	url := "https://echo-tube.vercel.app/get-transcript"
	payload := []byte(fmt.Sprintf(`{
		"videoUrl":"%s"
	}`, videoURL))

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(payload))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("HTTP request failed with status code: %d", resp.StatusCode)
	}

	var videoData VideoData
	if err := json.NewDecoder(resp.Body).Decode(&videoData); err != nil {
		return nil, err
	}

	return &videoData, nil
}
