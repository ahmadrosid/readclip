package util

import (
	"net/url"
	"time"
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
	return hostname == "reddit.com" || hostname == "www.reddit.com"
}
