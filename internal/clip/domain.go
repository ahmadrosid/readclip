package clip

import (
	"time"

	"github.com/google/uuid"
)

type Clip struct {
	Id          uuid.UUID `gorm:"primary_key;type:uuid;default:uuid_generate_v4()"`
	Url         string    `gorm:"size:255"`
	Title       string    `gorm:"size:255"`
	HashUrl     string    `gorm:"size:32;unique"`
	Description string
	Content     string
	Hostname    string     `gorm:"size:255"`
	UserID      uuid.UUID  `gorm:"type:uuid"`
	CreatedAt   *time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt   *time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	DeletedAt   *time.Time
}

type ClipRepository interface {
	GetAllClipData(perPage int, offset int, userID uuid.UUID) ([]Clip, error)
	GetClipById(id string, userID uuid.UUID) (Clip, error)
	GetClipByHashUrl(hash_url string, userID uuid.UUID) (Clip, error)
	CreateClip(clip Clip) (Clip, error)
	DeleteClipByID(id string, userID uuid.UUID) error
}
