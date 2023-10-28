package github

import (
	"fmt"

	"github.com/andygrunwald/go-trending"
)

type Metadata struct {
	Stars int `json:"stars"`
}

type TrendingItem struct {
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Link        string   `json:"link"`
	Author      string   `json:"author"`
	Metadata    Metadata `json:"metadata"`
}

type TrendingResult struct {
	Title       string         `json:"title"`
	Description string         `json:"description"`
	Link        string         `json:"link"`
	Items       []TrendingItem `json:"items"`
}

type Language struct {
	Label string `json:"label"`
	Value string `json:"value"`
}

func FetchLanguages() ([]Language, error) {
	trend := trending.NewTrending()

	result, err := trend.GetLanguages()
	if err != nil {
		return nil, err
	}

	var languages []Language
	for _, item := range result {
		languages = append(languages, Language{
			Label: item.Name,
			Value: item.URLName,
		})
	}

	return languages, nil
}

func FetchTrending(time string, language string) (*TrendingResult, error) {
	trend := trending.NewTrending()

	timeRange := trending.TimeWeek

	switch time {
	case "daily":
		timeRange = trending.TimeToday
	case "monthly":
		timeRange = trending.TimeMonth
	case "weekly":
		timeRange = trending.TimeMonth
	default:
		time = "weekly"
	}

	projects, err := trend.GetProjects(timeRange, language)
	if err != nil {
		return nil, err
	}

	items := make([]TrendingItem, 0)

	for _, project := range projects {
		items = append(items, TrendingItem{
			Title:       project.Name,
			Description: project.Description,
			Link:        project.URL.String(),
			Author:      project.Owner,
			Metadata: Metadata{
				Stars: project.Stars,
			},
		})
	}

	return &TrendingResult{
		Items:       items,
		Title:       fmt.Sprintf("Github Trending (%s - %s)", language, time),
		Link:        fmt.Sprintf("https://github.com/trending/%s?since=%s", language, time),
		Description: "Daily Trending in GitHub",
	}, nil
}
