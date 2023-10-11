package tag

import (
	"time"

	"github.com/google/uuid"
)

type ClipTag struct {
	Id        uuid.UUID  `gorm:"primary_key;type:uuid;default:uuid_generate_v4()"`
	TagID     uuid.UUID  `gorm:"type:uuid;index:idx_unique_tag,unique"`
	ClipID    uuid.UUID  `gorm:"type:uuid;index:idx_unique_tag,unique"`
	CreatedAt *time.Time `gorm:"default:CURRENT_TIMESTAMP"`
}

type Tag struct {
	Id        uuid.UUID  `gorm:"primary_key;type:uuid;default:uuid_generate_v4()"`
	UserID    uuid.UUID  `gorm:"type:uuid"`
	Name      string     `gorm:"size:100"`
	CreatedAt *time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt *time.Time `gorm:"default:CURRENT_TIMESTAMP"`
}

type InputCreateTag struct {
	Name string `json:"name"`
}

type InputCreateClipTag struct {
	ClipId string `json:"clip_id"`
	TagId  string `json:"tag_id"`
}

type TagRepository interface {
	CreateNewTag(name string, userId string) (*Tag, error)
	GetAllTag(userId string) ([]Tag, error)
	AddTagToClip(articleId string, tagId string) (*ClipTag, error)
	GetClipTag(clipId string) ([]Tag, error)
	DeleteClipTagByTagId(id string) error
	DeleteTag(id string) error
}
