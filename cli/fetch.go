// You can edit this code!
// Click here and start typing.
package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

func Fetch(path string) (string, error) {
	req, err := http.Get(path)
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", " */*")

	body, err := io.ReadAll(req.Body)
	if err != nil {
		return "", err
	}

	return string(body), nil
}

type GithubResponse struct {
	ID              int         `json:"id"`
	AvatarURL       string      `json:"avatar_url"`
	GravatarID      string      `json:"gravatar_id"`
	URL             string      `json:"url"`
	Name            string      `json:"name"`
	Blog            string      `json:"blog"`
	Email           interface{} `json:"email"`
	Bio             string      `json:"bio"`
	TwitterUsername string      `json:"twitter_username"`
	Followers       int         `json:"followers"`
	Following       int         `json:"following"`
	CreatedAt       time.Time   `json:"created_at"`
	UpdatedAt       time.Time   `json:"updated_at"`
}

func main() {
	response, err := Fetch("https://api.github.com/users/ahmadrosid")
	// continue
	if err != nil {
		fmt.Println("Error fetching data:", err)
		return
	}

	var githubResponse GithubResponse
	if err := json.Unmarshal([]byte(response), &githubResponse); err != nil {
		fmt.Println("Error parsing JSON:", err)
		return
	}

	fmt.Printf("User ID: %d\n", githubResponse.ID)
	fmt.Printf("User Name: %s\n", githubResponse.Name)
	fmt.Printf("Followers: %d\n", githubResponse.Followers)
	fmt.Printf("Twitter Username: %s\n", githubResponse.TwitterUsername)
	fmt.Printf("Bio: %s\n", githubResponse.Bio)
}
