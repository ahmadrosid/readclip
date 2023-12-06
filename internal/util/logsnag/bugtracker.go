package logsnag

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
)

func SendBugEvent(tags map[string]interface{}, id string) {

	url := "https://api.logsnag.com/v1/log"
	method := "POST"

	dataPayload := Data{
		Project:     "readclip",
		Event:       "Bug Report",
		UserID:      id,
		Description: "Bug report",
		Icon:        "🐛",
		Tags:        tags,
		Notify:      false,
		Channel:     "bookmark",
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
