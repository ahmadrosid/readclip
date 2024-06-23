package util

import (
	"net/url"
	"strings"
	"time"
)

var (
	UserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
)

func GetHostname(origin string) (string, error) {
	u, err := url.Parse(origin)
	if err != nil {
		return "", err
	}
	return u.Hostname(), nil
}

// get current datetime that can be parsed by javascript client
func GetCurrentDatetime() string {
	return time.Now().UTC().Format("2006-01-02T15:04:05.000Z")
}

func IsValidURL(str string) bool {
	u, err := url.Parse(str)
	return err == nil && u.Scheme != "" && u.Host != ""
}

func IsLocalhost(str string) bool {
	hostname, err := GetHostname(str)
	if err != nil {
		panic(err)
	}
	return hostname == "localhost"
}

func IsRedditUrl(str string) bool {
	hostname, err := GetHostname(str)
	if err != nil {
		panic(err)
	}
	return hostname == "reddit.com" || hostname == "www.reddit.com" || hostname == "old.reddit.com"
}

func IsMediumUrl(str string) bool {
	hostname, err := GetHostname(str)
	if err != nil {
		return false
	}

	validHosts := map[string]bool{
		"medium.com":               true,
		"www.medium.com":           true,
		"andrewzuo.com":            true,
		"levelup.gitconnected.com": true,
		"netflixtechblog.com":      true,
		"bettermarketing.pub":      true,
		"betterhumans.pub":         true,
		"towardsdatascience.com":   true,
		"uxdesign.cc":              true,
		"uxplanet.org":             true,
		"betterprogramming.pub":    true,
		"blog.prototypr.io":        true,
	}

	return validHosts[hostname] || strings.HasSuffix(hostname, ".medium.com")
}

func IsTweeterUrl(str string) bool {
	hostname, err := GetHostname(str)
	if err != nil {
		panic(err)
	}
	return hostname == "twitter.com" || hostname == "www.twitter.com" || hostname == "x.com"
}
