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
