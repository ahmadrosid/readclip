package clip

import (
	"time"

	"github.com/google/uuid"
)

var (
	defaultUserID = "32b28b74-78bc-46e0-b63a-7d0e91630f1d"
)

type Clip struct {
	Id          uuid.UUID `gorm:"primary_key;type:uuid;default:uuid_generate_v4()"`
	Url         string    `gorm:"size:255"`
	Title       string    `gorm:"size:255"`
	HashUrl     string    `gorm:"size:32;unique"`
	Description string
	Content     string
	Hostname    string     `gorm:"size:255"`
	CreatedAt   *time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt   *time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	DeletedAt   *time.Time
}

type ClipRepository interface {
	GetAllClipData(perPage int, offset int) ([]Clip, error)
	GetClipById(id string) (Clip, error)
	GetClipByHashUrl(hash_url string) (Clip, error)
	CreateClip(clip Clip) error
	DeleteClipByID(id string) error
}
