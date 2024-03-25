package reddit

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/ahmadrosid/readclip/internal/util"
	"github.com/ahmadrosid/readclip/internal/util/fetch"
)

type DataChildren struct {
	ApprovedAtUtc              interface{}   `json:"approved_at_utc"`
	Subreddit                  string        `json:"subreddit"`
	Selftext                   string        `json:"selftext"`
	Body                       string        `json:"body"`
	BodyHtml                   string        `json:"body_html"`
	UserReports                []interface{} `json:"user_reports"`
	Saved                      bool          `json:"saved"`
	ModReasonTitle             interface{}   `json:"mod_reason_title"`
	Gilded                     int           `json:"gilded"`
	Clicked                    bool          `json:"clicked"`
	Title                      string        `json:"title"`
	LinkFlairRichtext          []interface{} `json:"link_flair_richtext"`
	SubredditNamePrefixed      string        `json:"subreddit_name_prefixed"`
	Hidden                     bool          `json:"hidden"`
	Pwls                       int           `json:"pwls"`
	LinkFlairCSSClass          string        `json:"link_flair_css_class"`
	Downs                      int           `json:"downs"`
	ThumbnailHeight            interface{}   `json:"thumbnail_height"`
	TopAwardedType             interface{}   `json:"top_awarded_type"`
	ParentWhitelistStatus      string        `json:"parent_whitelist_status"`
	HideScore                  bool          `json:"hide_score"`
	Name                       string        `json:"name"`
	Quarantine                 bool          `json:"quarantine"`
	LinkFlairTextColor         string        `json:"link_flair_text_color"`
	AuthorFlairBackgroundColor interface{}   `json:"author_flair_background_color"`
	SubredditType              string        `json:"subreddit_type"`
	Ups                        int           `json:"ups"`
	TotalAwardsReceived        int           `json:"total_awards_received"`
	MediaEmbed                 struct {
	} `json:"media_embed"`
	ThumbnailWidth        interface{} `json:"thumbnail_width"`
	AuthorFlairTemplateID interface{} `json:"author_flair_template_id"`
	IsOriginalContent     bool        `json:"is_original_content"`
	AuthorFullname        string      `json:"author_fullname"`
	SecureMedia           interface{} `json:"secure_media"`
	IsRedditMediaDomain   bool        `json:"is_reddit_media_domain"`
	IsMeta                bool        `json:"is_meta"`
	Category              interface{} `json:"category"`
	SecureMediaEmbed      struct {
	} `json:"secure_media_embed"`
	LinkFlairText       string        `json:"link_flair_text"`
	CanModPost          bool          `json:"can_mod_post"`
	Score               int           `json:"score"`
	ApprovedBy          interface{}   `json:"approved_by"`
	IsCreatedFromAdsUI  bool          `json:"is_created_from_ads_ui"`
	AuthorPremium       bool          `json:"author_premium"`
	Thumbnail           string        `json:"thumbnail"`
	AuthorFlairCSSClass interface{}   `json:"author_flair_css_class"`
	AuthorFlairRichtext []interface{} `json:"author_flair_richtext"`
	Gildings            struct {
	} `json:"gildings"`
	ContentCategories        interface{}   `json:"content_categories"`
	IsSelf                   bool          `json:"is_self"`
	ModNote                  interface{}   `json:"mod_note"`
	Created                  float64       `json:"created"`
	LinkFlairType            string        `json:"link_flair_type"`
	Wls                      int           `json:"wls"`
	RemovedByCategory        interface{}   `json:"removed_by_category"`
	BannedBy                 interface{}   `json:"banned_by"`
	AuthorFlairType          string        `json:"author_flair_type"`
	Domain                   string        `json:"domain"`
	AllowLiveComments        bool          `json:"allow_live_comments"`
	SelftextHTML             string        `json:"selftext_html"`
	Likes                    interface{}   `json:"likes"`
	SuggestedSort            string        `json:"suggested_sort"`
	BannedAtUtc              interface{}   `json:"banned_at_utc"`
	ViewCount                interface{}   `json:"view_count"`
	Archived                 bool          `json:"archived"`
	NoFollow                 bool          `json:"no_follow"`
	IsCrosspostable          bool          `json:"is_crosspostable"`
	Pinned                   bool          `json:"pinned"`
	Over18                   bool          `json:"over_18"`
	AllAwardings             []interface{} `json:"all_awardings"`
	Awarders                 []interface{} `json:"awarders"`
	MediaOnly                bool          `json:"media_only"`
	LinkFlairTemplateID      string        `json:"link_flair_template_id"`
	CanGild                  bool          `json:"can_gild"`
	Spoiler                  bool          `json:"spoiler"`
	Locked                   bool          `json:"locked"`
	AuthorFlairText          interface{}   `json:"author_flair_text"`
	TreatmentTags            []interface{} `json:"treatment_tags"`
	Visited                  bool          `json:"visited"`
	RemovedBy                interface{}   `json:"removed_by"`
	NumReports               interface{}   `json:"num_reports"`
	Distinguished            interface{}   `json:"distinguished"`
	SubredditID              string        `json:"subreddit_id"`
	AuthorIsBlocked          bool          `json:"author_is_blocked"`
	ModReasonBy              interface{}   `json:"mod_reason_by"`
	RemovalReason            interface{}   `json:"removal_reason"`
	LinkFlairBackgroundColor string        `json:"link_flair_background_color"`
	ID                       string        `json:"id"`
	IsRobotIndexable         bool          `json:"is_robot_indexable"`
	NumDuplicates            int           `json:"num_duplicates"`
	ReportReasons            interface{}   `json:"report_reasons"`
	Author                   string        `json:"author"`
	DiscussionType           interface{}   `json:"discussion_type"`
	NumComments              int           `json:"num_comments"`
	SendReplies              bool          `json:"send_replies"`
	Media                    interface{}   `json:"media"`
	ContestMode              bool          `json:"contest_mode"`
	AuthorPatreonFlair       bool          `json:"author_patreon_flair"`
	AuthorFlairTextColor     interface{}   `json:"author_flair_text_color"`
	Permalink                string        `json:"permalink"`
	WhitelistStatus          string        `json:"whitelist_status"`
	Stickied                 bool          `json:"stickied"`
	URL                      string        `json:"url"`
	SubredditSubscribers     int           `json:"subreddit_subscribers"`
	CreatedUtc               float64       `json:"created_utc"`
	NumCrossposts            int           `json:"num_crossposts"`
	ModReports               []interface{} `json:"mod_reports"`
	IsVideo                  bool          `json:"is_video"`
	// Replies                  *[]Children   `json:"replies,omitempty"`
}

type Children struct {
	Kind string       `json:"kind"`
	Data DataChildren `json:"data"`
}

type RedditResponse []struct {
	Kind string `json:"kind"`
	Data struct {
		After     interface{} `json:"after"`
		Dist      int         `json:"dist"`
		Modhash   string      `json:"modhash"`
		GeoFilter string      `json:"geo_filter"`
		Children  []Children  `json:"children"`
		Before    interface{} `json:"before"`
	} `json:"data"`
}

func GenerateRedditRssUrl(room string) string {
	return "https://www.reddit.com/r/" + room + "/.rss"
}

func GenerateRedditJsonUrl(room string) string {
	return "https://api.ahmadrosid.com/reddit/r/" + room
}

func ScrapeReddit(url string) (*util.ContentData, error) {
	redditUrl := strings.Replace(url, "https://reddit.com/", "https://api.ahmadrosid.com/reddit/", -1)
	req, err := http.NewRequest("GET", redditUrl, nil)
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

	var redditData RedditResponse
	if err := json.NewDecoder(resp.Body).Decode(&redditData); err != nil {
		return nil, err
	}

	if len(redditData) == 0 {
		return nil, fmt.Errorf("no data found")
	}

	question := redditData[0]
	mainContent := question.Data.Children[0].Data.Selftext

	for _, item := range redditData[1:] {
		mainContent += "\n## Comments:\n"
		for _, child := range item.Data.Children {
			if child.Kind == "t1" {
				mainContent += "\n**Reply from: " + child.Data.Author + "**\n"
				mainContent += ">" + child.Data.Body + "\n"
			}
		}
	}

	return &util.ContentData{
		Url:     url,
		Title:   question.Data.Children[0].Data.Title,
		Content: mainContent,
		Metadata: &util.Metadata{
			Title:       question.Data.Children[0].Data.Title,
			Author:      question.Data.Children[0].Data.AuthorFullname,
			Hostname:    "reddit.com",
			URL:         url,
			Sitename:    "Reddit",
			Description: mainContent[0:70],
		},
	}, nil
}

type OptionalTime struct {
	time.Time
}

func (ct *OptionalTime) UnmarshalJSON(data []byte) error {
	var timestamp interface{}
	if err := json.Unmarshal(data, &timestamp); err != nil {
		return err
	}

	switch v := timestamp.(type) {
	case float64:
		ct.Time = time.Unix(int64(v), 0)
	case bool:
		return nil
	default:
		return fmt.Errorf("unexpected type for timestamp: %T", v)
	}

	return nil
}

type SubChildren struct {
	Kind string `json:"kind"`
	Data struct {
		ApprovedAtUtc              interface{}   `json:"approved_at_utc"`
		Subreddit                  string        `json:"subreddit"`
		Selftext                   string        `json:"selftext"`
		AuthorFullname             string        `json:"author_fullname"`
		Saved                      bool          `json:"saved"`
		ModReasonTitle             interface{}   `json:"mod_reason_title"`
		Gilded                     int           `json:"gilded"`
		Clicked                    bool          `json:"clicked"`
		Title                      string        `json:"title"`
		LinkFlairRichtext          []interface{} `json:"link_flair_richtext"`
		SubredditNamePrefixed      string        `json:"subreddit_name_prefixed"`
		Hidden                     bool          `json:"hidden"`
		Pwls                       int           `json:"pwls"`
		LinkFlairCSSClass          string        `json:"link_flair_css_class"`
		Downs                      int           `json:"downs"`
		ThumbnailHeight            int           `json:"thumbnail_height"`
		TopAwardedType             interface{}   `json:"top_awarded_type"`
		HideScore                  bool          `json:"hide_score"`
		Name                       string        `json:"name"`
		Quarantine                 bool          `json:"quarantine"`
		LinkFlairTextColor         interface{}   `json:"link_flair_text_color"`
		UpvoteRatio                float64       `json:"upvote_ratio"`
		AuthorFlairBackgroundColor interface{}   `json:"author_flair_background_color"`
		Ups                        int           `json:"ups"`
		TotalAwardsReceived        int           `json:"total_awards_received"`
		MediaEmbed                 struct {
		} `json:"media_embed"`
		ThumbnailWidth        int           `json:"thumbnail_width"`
		AuthorFlairTemplateID interface{}   `json:"author_flair_template_id"`
		IsOriginalContent     bool          `json:"is_original_content"`
		UserReports           []interface{} `json:"user_reports"`
		SecureMedia           struct {
			RedditVideo struct {
				BitrateKbps       int    `json:"bitrate_kbps"`
				FallbackURL       string `json:"fallback_url"`
				HasAudio          bool   `json:"has_audio"`
				Height            int    `json:"height"`
				Width             int    `json:"width"`
				ScrubberMediaURL  string `json:"scrubber_media_url"`
				DashURL           string `json:"dash_url"`
				Duration          int    `json:"duration"`
				HlsURL            string `json:"hls_url"`
				IsGif             bool   `json:"is_gif"`
				TranscodingStatus string `json:"transcoding_status"`
			} `json:"reddit_video"`
		} `json:"secure_media"`
		IsRedditMediaDomain bool        `json:"is_reddit_media_domain"`
		IsMeta              bool        `json:"is_meta"`
		Category            interface{} `json:"category"`
		SecureMediaEmbed    struct {
		} `json:"secure_media_embed"`
		LinkFlairText       string        `json:"link_flair_text"`
		CanModPost          bool          `json:"can_mod_post"`
		Score               int           `json:"score"`
		ApprovedBy          interface{}   `json:"approved_by"`
		IsCreatedFromAdsUI  bool          `json:"is_created_from_ads_ui"`
		AuthorPremium       bool          `json:"author_premium"`
		Thumbnail           string        `json:"thumbnail"`
		Edited              OptionalTime  `json:"edited"`
		AuthorFlairCSSClass interface{}   `json:"author_flair_css_class"`
		AuthorFlairRichtext []interface{} `json:"author_flair_richtext"`
		Gildings            struct{}      `json:"gildings"`
		PostHint            string        `json:"post_hint"`
		ContentCategories   interface{}   `json:"content_categories"`
		IsSelf              bool          `json:"is_self"`
		SubredditType       string        `json:"subreddit_type"`
		Created             float64       `json:"created"`
		LinkFlairType       string        `json:"link_flair_type"`
		Wls                 int           `json:"wls"`
		RemovedByCategory   interface{}   `json:"removed_by_category"`
		BannedBy            interface{}   `json:"banned_by"`
		AuthorFlairType     string        `json:"author_flair_type"`
		Domain              string        `json:"domain"`
		AllowLiveComments   bool          `json:"allow_live_comments"`
		SelftextHTML        interface{}   `json:"selftext_html"`
		Likes               interface{}   `json:"likes"`
		SuggestedSort       interface{}   `json:"suggested_sort"`
		BannedAtUtc         interface{}   `json:"banned_at_utc"`
		URLOverriddenByDest string        `json:"url_overridden_by_dest"`
		ViewCount           interface{}   `json:"view_count"`
		Archived            bool          `json:"archived"`
		NoFollow            bool          `json:"no_follow"`
		IsCrosspostable     bool          `json:"is_crosspostable"`
		Pinned              bool          `json:"pinned"`
		Over18              bool          `json:"over_18"`
		Preview             struct {
			Images []struct {
				Source struct {
					URL    string `json:"url"`
					Width  int    `json:"width"`
					Height int    `json:"height"`
				} `json:"source"`
				Resolutions []struct {
					URL    string `json:"url"`
					Width  int    `json:"width"`
					Height int    `json:"height"`
				} `json:"resolutions"`
				Variants struct {
				} `json:"variants"`
				ID string `json:"id"`
			} `json:"images"`
			Enabled bool `json:"enabled"`
		} `json:"preview"`
		AllAwardings             []interface{} `json:"all_awardings"`
		Awarders                 []interface{} `json:"awarders"`
		MediaOnly                bool          `json:"media_only"`
		LinkFlairTemplateID      string        `json:"link_flair_template_id"`
		CanGild                  bool          `json:"can_gild"`
		Spoiler                  bool          `json:"spoiler"`
		Locked                   bool          `json:"locked"`
		AuthorFlairText          interface{}   `json:"author_flair_text"`
		TreatmentTags            []interface{} `json:"treatment_tags"`
		Visited                  bool          `json:"visited"`
		RemovedBy                interface{}   `json:"removed_by"`
		ModNote                  interface{}   `json:"mod_note"`
		Distinguished            interface{}   `json:"distinguished"`
		SubredditID              string        `json:"subreddit_id"`
		AuthorIsBlocked          bool          `json:"author_is_blocked"`
		ModReasonBy              interface{}   `json:"mod_reason_by"`
		NumReports               interface{}   `json:"num_reports"`
		RemovalReason            interface{}   `json:"removal_reason"`
		LinkFlairBackgroundColor string        `json:"link_flair_background_color"`
		ID                       string        `json:"id"`
		IsRobotIndexable         bool          `json:"is_robot_indexable"`
		ReportReasons            interface{}   `json:"report_reasons"`
		Author                   string        `json:"author"`
		DiscussionType           interface{}   `json:"discussion_type"`
		NumComments              int           `json:"num_comments"`
		SendReplies              bool          `json:"send_replies"`
		WhitelistStatus          string        `json:"whitelist_status"`
		ContestMode              bool          `json:"contest_mode"`
		ModReports               []interface{} `json:"mod_reports"`
		AuthorPatreonFlair       bool          `json:"author_patreon_flair"`
		AuthorFlairTextColor     interface{}   `json:"author_flair_text_color"`
		Permalink                string        `json:"permalink"`
		ParentWhitelistStatus    string        `json:"parent_whitelist_status"`
		Stickied                 bool          `json:"stickied"`
		URL                      string        `json:"url"`
		SubredditSubscribers     int           `json:"subreddit_subscribers"`
		CreatedUtc               float64       `json:"created_utc"`
		NumCrossposts            int           `json:"num_crossposts"`
		Media                    struct {
			RedditVideo struct {
				BitrateKbps       int    `json:"bitrate_kbps"`
				FallbackURL       string `json:"fallback_url"`
				HasAudio          bool   `json:"has_audio"`
				Height            int    `json:"height"`
				Width             int    `json:"width"`
				ScrubberMediaURL  string `json:"scrubber_media_url"`
				DashURL           string `json:"dash_url"`
				Duration          int    `json:"duration"`
				HlsURL            string `json:"hls_url"`
				IsGif             bool   `json:"is_gif"`
				TranscodingStatus string `json:"transcoding_status"`
			} `json:"reddit_video"`
		} `json:"media"`
		IsVideo bool `json:"is_video"`
	} `json:"data"`
}

type ResponseRedditJson struct {
	Data struct {
		Children []SubChildren `json:"children"`
	} `json:"data"`
}

func GetSubreddit(room string) (*util.FeedResult, error) {
	url := GenerateRedditJsonUrl(room)
	resp, err := fetch.Fetch(url)
	if err != nil {
		return nil, err
	}

	var data ResponseRedditJson
	err = json.Unmarshal([]byte(resp), &data)
	if err != nil {
		fmt.Println("Error parsing JSON:", err)
		return nil, err
	}

	feedResult := util.FeedResult{
		Title:       "Reddit - " + room,
		Description: "Reddit " + room + " Front page",
		Link:        "https://reddit.com/r/" + room,
		Items:       make([]util.FeedItem, 0),
	}

	for _, item := range data.Data.Children {
		feedItem := util.FeedItem{
			Title: item.Data.Title,
			Link:  fmt.Sprintf("https://reddit.com%s", item.Data.Permalink),
		}

		// if item.Data.Thumbnail != "self" {
		// 	render := fmt.Sprintf(
		// 		`<div className="text-sm text-gray-400"><p>%s</p><div class="flex gap-2"><img src="%s" alt="source" class="w-12 aspect-square object-cover rounded-md border" /><p>%.120s...</p></div></div>`,
		// 		item.Data.SubredditNamePrefixed,
		// 		item.Data.Thumbnail,
		// 		item.Data.Selftext,
		// 	)
		// 	feedItem.Description = render
		// } else {
		render := fmt.Sprintf(
			"<div><span>%s</span><p>%.160s</p></div>",
			item.Data.SubredditNamePrefixed,
			item.Data.Selftext,
		)
		feedItem.Description = render
		// }
		feedResult.Items = append(feedResult.Items, feedItem)
	}

	return &feedResult, err
}
