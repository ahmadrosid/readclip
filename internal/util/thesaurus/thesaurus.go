package thesaurus

import (
	"bufio"
	"encoding/json"
	"os"
)

type WordData struct {
	Word     string   `json:"word"`
	Key      string   `json:"key"`
	Pos      string   `json:"pos"`
	Synonyms []string `json:"synonyms"`
}

func ParseWordData() ([]WordData, error) {
	file, err := os.Open("./assets/en_thesaurus.jsonl")
	if err != nil {
		return nil, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	var words []WordData
	for scanner.Scan() {
		var word WordData
		err := json.Unmarshal(scanner.Bytes(), &word)
		if err != nil {
			continue
		}
		words = append(words, word)
	}

	if err := scanner.Err(); err != nil {
		return nil, err
	}

	return words, nil
}
