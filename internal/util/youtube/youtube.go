package youtube

import (
	"encoding/json"
	"fmt"
	"net/url"
	"strings"
	"time"

	"github.com/ahmadrosid/readclip/internal/util"
	"github.com/ahmadrosid/readclip/internal/util/fetch"
	"github.com/kkdai/youtube/v2"
)

type VideoInfo struct {
	PublishedAt time.Time `json:"publishedAt"`
	ChannelID   string    `json:"channelId"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Thumbnails  struct {
		Default struct {
			URL    string `json:"url"`
			Width  int    `json:"width"`
			Height int    `json:"height"`
		} `json:"default"`
		Medium struct {
			URL    string `json:"url"`
			Width  int    `json:"width"`
			Height int    `json:"height"`
		} `json:"medium"`
		High struct {
			URL    string `json:"url"`
			Width  int    `json:"width"`
			Height int    `json:"height"`
		} `json:"high"`
		Standard struct {
			URL    string `json:"url"`
			Width  int    `json:"width"`
			Height int    `json:"height"`
		} `json:"standard"`
		Maxres struct {
			URL    string `json:"url"`
			Width  int    `json:"width"`
			Height int    `json:"height"`
		} `json:"maxres"`
	} `json:"thumbnails"`
	ChannelTitle         string `json:"channelTitle"`
	CategoryID           string `json:"categoryId"`
	LiveBroadcastContent string `json:"liveBroadcastContent"`
	Localized            struct {
		Title       string `json:"title"`
		Description string `json:"description"`
	} `json:"localized"`
	DefaultAudioLanguage string `json:"defaultAudioLanguage"`
}

// Typical YouTube URL formats:
// https://www.youtube.com/watch?v=VIDEO_ID
// https://youtu.be/VIDEO_ID
// https://www.youtube.com/embed/VIDEO_ID
// https://www.youtube.com/v/VIDEO_ID?version=3&autohide=1
func GetVideoID(youtubeURL string) (string, error) {
	u, err := url.Parse(youtubeURL)
	if err != nil {
		return "", err
	}

	switch {
	case u.Host == "youtu.be":
		return strings.TrimPrefix(u.Path, "/"), nil
	case u.Host == "www.youtube.com" || u.Host == "youtube.com":
		if u.Path == "/watch" {
			return u.Query().Get("v"), nil
		}
		if strings.HasPrefix(u.Path, "/embed/") || strings.HasPrefix(u.Path, "/v/") {
			return strings.TrimPrefix(u.Path, "/embed/"), nil
		}
		if strings.HasPrefix(u.Path, "/shorts/") {
			videoID := strings.TrimPrefix(u.Path, "/shorts/")
			return videoID, nil
		}
	}

	return "", fmt.Errorf("unrecognized YouTube URL format")
}

func IsValidYoutubeUrl(genericUrl string) bool {
	u, err := url.Parse(genericUrl)
	if err != nil {
		return false
	}

	switch {
	case u.Host == "youtu.be":
		return true
	case u.Host == "www.youtube.com" || u.Host == "youtube.com":
		if u.Path == "/watch" {
			return true
		}
		if strings.HasPrefix(u.Path, "/embed/") || strings.HasPrefix(u.Path, "/v/") {
			return true
		}
		if strings.HasPrefix(u.Path, "/shorts/") {
			return true
		}
	}

	return false
}

func GetVideoInfo(videoUrl string) (*youtube.Video, error) {
	videoID, err := GetVideoID(videoUrl)
	if err != nil {
		return nil, err
	}

	client := youtube.Client{}

	video, err := client.GetVideo(videoID)
	if err != nil {
		return nil, err
	}

	return video, nil
}

func GrabYoutubeVideoInfo(videoUrl string) (*util.ContentData, error) {
	// video, err := GetVideoInfo(videoUrl)
	url := "https://api.ahmadrosid.com/youtube/video?videoUrl=" + videoUrl
	jsonStr, err := fetch.Fetch(url)
	if err != nil {
		return nil, err
	}

	var video VideoInfo
	err = json.Unmarshal([]byte(jsonStr), &video)
	if err != nil {
		return nil, err
	}

	imgUrl := video.Thumbnails.Default.URL

	return &util.ContentData{
		Url:     videoUrl,
		Title:   video.Title,
		Content: video.Description,
		Metadata: &util.Metadata{
			Title:       video.Title,
			Author:      "",
			Description: video.Description[0:100] + "...",
			Hostname:    "youtube.com",
			Image:       imgUrl,
			Sitename:    "YouTube",
			Date:        video.PublishedAt,
			PageType:    "video",
		},
	}, nil
}
