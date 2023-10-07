package logsnag

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
)

type Data struct {
	Project     string            `json:"project"`
	Event       string            `json:"event"`
	UserID      string            `json:"user_id"`
	Description string            `json:"description"`
	Icon        string            `json:"icon"`
	Tags        map[string]string `json:"tags"`
	Notify      bool              `json:"notify"`
	Channel     string            `json:"channel"`
}

func SendEventUserRegister(name string, id string) {

	url := "https://api.logsnag.com/v1/log"
	method := "POST"

	dataPayload := Data{
		Project:     "readclip",
		Event:       "New User Signup",
		UserID:      id,
		Description: "New user " + name,
		Icon:        "🙋",
		Tags: map[string]string{
			"user": "register",
		},
		Notify:  false,
		Channel: "user-register",
	}

	payload, err := json.Marshal(dataPayload)
	if err != nil {
		fmt.Println(err)
		return
	}

	client := &http.Client{}
	req, err := http.NewRequest(method, url, strings.NewReader(string(payload)))

	if err != nil {
		fmt.Println(err)
		return
	}

	logSnagToken := os.Getenv("LOGSNAG_TOKEN")
	if logSnagToken == "" {
		fmt.Println("LOGSNAG_TOKEN is not set")
		return
	}

	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Authorization", "Bearer "+logSnagToken)

	res, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(string(body))
}
