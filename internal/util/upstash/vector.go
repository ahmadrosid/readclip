package upstash

import (
	"fmt"
	"net/http"

	"github.com/ahmadrosid/readclip/internal/util/config"
	"github.com/upstash/vector-go"
)

type VectorData struct {
	Id     string `json:"id"`
	UserId string `json:"user_id"`
	Data   string `json:"data"`
}

func GetIndex(config config.Uptash) *vector.Index {
	opts := vector.Options{
		Url:    config.VectorDatabaseUrl,
		Token:  config.VectorDatabaseToken,
		Client: &http.Client{},
	}

	index := vector.NewIndexWith(opts)

	return index
}

func SearchVectorData(config config.Uptash, query string) ([]VectorData, error) {
	index := GetIndex(config)
	scores, err := index.QueryData(vector.QueryData{
		Data:            query,
		TopK:            2,
		IncludeVectors:  false,
		IncludeMetadata: true,
	})
	if err != nil {
		return nil, err
	}

	var data []VectorData
	for _, hit := range scores {
		data = append(data, VectorData{
			Id:     hit.Id,
			UserId: fmt.Sprintf("%s", hit.Metadata["user_id"]),
			Data:   fmt.Sprintf("%s", hit.Metadata["content"]),
		})
	}

	return data, nil
}

func InsertVectorData(config config.Uptash, userData []VectorData) error {
	index := GetIndex(config)

	chunks := make([]vector.UpsertData, 0)
	for _, data := range userData {
		chunks = append(chunks, vector.UpsertData{
			Id:   data.Id,
			Data: data.Data,
			Metadata: map[string]any{
				"user_id": data.UserId,
				"content": data.Data,
			},
		})
	}
	err := index.UpsertDataMany(chunks)

	return err
}
