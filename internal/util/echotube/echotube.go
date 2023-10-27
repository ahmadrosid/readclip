package echotube

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/ahmadrosid/readclip/internal/util"
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

// type FindChannelResponse struct {
// 	Data []struct {
// 		Type       string `json:"type"`
// 		ID         string `json:"id"`
// 		Text       string `json:"text"`
// 		Thumbnails []struct {
// 			URL    string `json:"url"`
// 			Width  int    `json:"width"`
// 			Height int    `json:"height"`
// 		} `json:"thumbnails"`
// 		SubscriberCount string `json:"subscriber_count,omitempty"`
// 		VideoCount      string `json:"video_count"`
// 	} `json:"data"`
// }

type FindChannelResponse []struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Thumbnail string `json:"thumbnail"`
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
	req.Header.Set("User-Agent", util.UserAgent)

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

func FindChannels(query string) (*FindChannelResponse, error) {
	// url := "https://echo-tube.vercel.app/channels"
	url := "https://feedful.app/api/youtube?search=" + query
	// payload := []byte(fmt.Sprintf(`{
	// 	"query":"%s"
	// }`, query))
	// req, err := http.NewRequest("POST", url, bytes.NewBuffer(payload))
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", util.UserAgent)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusNotFound {
		return nil, fmt.Errorf("can't not found channel: %s", query)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("HTTP request failed with status code: %d", resp.StatusCode)
	}

	var result FindChannelResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return &result, nil
}
