package util

import "time"

type ContentData struct {
	Url      string
	Title    string
	Content  string
	Metadata *Metadata
}

type Metadata struct {
	Title       string
	Author      string
	URL         string
	Hostname    string
	Description string
	Sitename    string
	Date        time.Time
	Categories  []string
	Tags        []string
	ID          string
	Fingerprint string
	License     string
	Language    string
	Image       string
	PageType    string
}

type FeedMetadata struct {
	Stars int    `json:"stars"`
	Vote  string `json:"vote"`
}

type FeedItem struct {
	Title       string       `json:"title"`
	Description string       `json:"description"`
	Link        string       `json:"link"`
	Author      string       `json:"author"`
	Date        string       `json:"date"`
	Metadata    FeedMetadata `json:"metadata"`
}

type FeedResult struct {
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Link        string     `json:"link"`
	Items       []FeedItem `json:"items"`
}
