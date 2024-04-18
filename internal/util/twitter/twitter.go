package twitter

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/url"
	"strings"
	"time"

	"github.com/ahmadrosid/readclip/internal/util"
	"github.com/ahmadrosid/readclip/internal/util/fetch"
	"github.com/ahmadrosid/readclip/internal/util/str"
)

type TwitterStatusResponse struct {
	Data struct {
		EditHistoryTweetIds []string `json:"edit_history_tweet_ids"`
		Entities            struct {
			Mentions []struct {
				Start    int    `json:"start"`
				End      int    `json:"end"`
				Username string `json:"username"`
				ID       string `json:"id"`
			} `json:"mentions"`
			Urls []struct {
				Start       int    `json:"start"`
				End         int    `json:"end"`
				URL         string `json:"url"`
				ExpandedURL string `json:"expanded_url"`
				DisplayURL  string `json:"display_url"`
				Images      []struct {
					URL    string `json:"url"`
					Width  int    `json:"width"`
					Height int    `json:"height"`
				} `json:"images,omitempty"`
				Status      int    `json:"status,omitempty"`
				Title       string `json:"title,omitempty"`
				Description string `json:"description,omitempty"`
				UnwoundURL  string `json:"unwound_url,omitempty"`
			} `json:"urls"`
		} `json:"entities"`
		AuthorID       string    `json:"author_id"`
		ID             string    `json:"id"`
		Lang           string    `json:"lang"`
		CreatedAt      time.Time `json:"created_at"`
		ConversationID string    `json:"conversation_id"`
		PublicMetrics  struct {
			RetweetCount    int `json:"retweet_count"`
			ReplyCount      int `json:"reply_count"`
			LikeCount       int `json:"like_count"`
			QuoteCount      int `json:"quote_count"`
			BookmarkCount   int `json:"bookmark_count"`
			ImpressionCount int `json:"impression_count"`
		} `json:"public_metrics"`
		Text string `json:"text"`
	} `json:"data"`
	Includes struct {
		Users []struct {
			ProfileImageURL string `json:"profile_image_url"`
			Verified        bool   `json:"verified"`
			ID              string `json:"id"`
			Name            string `json:"name"`
			Username        string `json:"username"`
		} `json:"users"`
	} `json:"includes"`
}

func GetTwitterIDsFromURL(twitterURL string) (string, error) {
	u, err := url.Parse(twitterURL)
	if err != nil {
		return "", err
	}
	if u.Host != "twitter.com" {
		return "", errors.New("invalid Twitter URL")
	}

	pathComponents := strings.Split(u.Path, "/")

	if len(pathComponents) < 4 {
		return "", errors.New("invalid Twitter URL format")
	}

	// Extract the Twitter user ID and tweet ID from the path components
	// twitterUserID := pathComponents[1]
	tweetID := pathComponents[len(pathComponents)-1]

	return tweetID, nil
}

func GetTwitterSttusInfo(tweetUrl string) (*TwitterStatusResponse, error) {
	// curl 'https://vividshare.io/api/tweet?id=1780554566121263576'
	tweetId, err := GetTwitterIDsFromURL(tweetUrl)
	if err != nil {
		return nil, err
	}

	fetchURL := fmt.Sprintf("https://vividshare.io/api/tweet?id=%s", tweetId)
	jsonStr, err := fetch.Fetch(fetchURL)
	if err != nil {
		return nil, err
	}

	var data TwitterStatusResponse
	err = json.Unmarshal([]byte(jsonStr), &data)
	if err != nil {
		return nil, err
	}

	return &data, nil
}

func sliceStringTitle(s string) string {
	lines := strings.Split(s, "\n")
	if len(lines) == 1 || len(lines[0]) > 60 {
		return lines[0][:60]
	}

	return lines[0]
}

func MapTwitterStatusToClip(tweetUrl string, status *TwitterStatusResponse) *util.ContentData {
	u, _ := url.Parse(tweetUrl)
	Description := str.TrimTo(status.Data.Text, 80)
	if len(status.Data.Text) > 80 {
		Description = Description + "..."
	}

	Title := sliceStringTitle(status.Includes.Users[0].Name + " on X: " + status.Data.Text)

	return &util.ContentData{
		Url:     tweetUrl,
		Title:   Title,
		Content: status.Data.Text,
		Metadata: &util.Metadata{
			Title:       status.Includes.Users[0].Name + " on X",
			Author:      status.Includes.Users[0].Name,
			URL:         tweetUrl,
			Hostname:    u.Host,
			Description: Description,
			Sitename:    "Twitter",
			Date:        time.Now(),
			Categories:  []string{"Social Media"},
			Tags:        []string{"Social Media"},
			ID:          "",
			Fingerprint: "",
			License:     "",
			Language:    status.Data.Lang,
			Image:       status.Includes.Users[0].ProfileImageURL,
			PageType:    "",
		},
	}
}
