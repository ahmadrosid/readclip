package util

import (
	"fmt"
	"net/url"
	"strings"

	"github.com/kkdai/youtube/v2"
)

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
			// If the URL is a Shorts URL, transform it to the "watch?v=" format
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
	}

	return false
}

func GrabYoutubeVideoInfo(videoUrl string) (*ContentData, error) {
	videoID, err := GetVideoID(videoUrl)
	if err != nil {
		return nil, err
	}

	client := youtube.Client{}

	video, err := client.GetVideo(videoID)
	if err != nil {
		return nil, err
	}

	imgUrl := ""
	for _, thumbnail := range video.Thumbnails {
		imgUrl = thumbnail.URL
		break
	}

	Content := ""
	ContentLines := strings.Split(video.Description, "\n")
	for i := 0; i < len(ContentLines); i++ {
		Content = Content + "\n" + ContentLines[i] + "\n"
	}

	return &ContentData{
		Url:     videoUrl,
		Title:   video.Title,
		Content: Content,
		Metadata: &Metadata{
			Title:       video.Title,
			Author:      video.Author,
			Description: video.Description[0:100] + "...",
			Hostname:    "youtube.com",
			Image:       imgUrl,
			Sitename:    "YouTube",
			Date:        video.PublishDate,
			PageType:    "video",
		},
	}, nil
}
