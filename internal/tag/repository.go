package tag

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type tagGormRepository struct {
	db *gorm.DB
}

func (repo *tagGormRepository) AddTagToClip(clipId string, tagId string) (*ClipTag, error) {
	var now = time.Now().UTC()
	var clipTag = &ClipTag{
		ClipID:    clipId,
		TagID:     tagId,
		CreatedAt: &now,
	}
	err := repo.db.Create(
		clipTag,
	).Error
	return clipTag, err
}

func (repo *tagGormRepository) CreateNewTag(name string, userId string) (*Tag, error) {
	var now = time.Now().UTC()
	var tag = &Tag{
		Name:      name,
		UserID:    uuid.MustParse(userId),
		CreatedAt: &now,
		UpdatedAt: &now,
	}
	err := repo.db.Create(tag).Error
	return tag, err
}

func (repo *tagGormRepository) GetAllTag(userId string) ([]Tag, error) {
	var tags []Tag
	err := repo.db.Where("user_id = ?", userId).Find(&tags).Error
	return tags, err
}

func NewTagRepository(db *gorm.DB) TagRepository {
	return &tagGormRepository{
		db: db,
	}
}
