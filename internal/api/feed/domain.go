package feed

import (
	"database/sql/driver"
	"encoding/json"
	"time"

	_ "github.com/lib/pq"

	"github.com/google/uuid"
)

type JSONB map[string]interface{}

func (j JSONB) Value() (driver.Value, error) {
	valueString, err := json.Marshal(j)
	return string(valueString), err
}

func (j *JSONB) Scan(value interface{}) error {
	if err := json.Unmarshal(value.([]byte), &j); err != nil {
		return err
	}
	return nil
}

type Feed struct {
	Id        uuid.UUID  `gorm:"primary_key;type:uuid;default:uuid_generate_v4()"`
	UserID    uuid.UUID  `gorm:"index;type:uuid"`
	Content   JSONB      `gorm:"type:JSONB"`
	ExpiredAt *time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	CreatedAt *time.Time `gorm:"default:CURRENT_TIMESTAMP"`
}

type RssFeedRequest struct {
	Url     string   `json:"url"`
	Type    string   `json:"type"`
	Options []string `json:"options"`
}

type FeedRepository interface {
	GetFeedById(id string, userID uuid.UUID) (Feed, error)
	CreateFeed(feed Feed) (Feed, error)
	DeleteFeedByID(id string, userID uuid.UUID) error
	UpdateFeed(feed Feed) error
}
