package tag

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type tagRepository struct {
	db *gorm.DB
}

func (repo *tagRepository) DeleteClipTag(id string) error {
	err := repo.db.Where("id = ?", id).Delete(&Tag{}).Error
	if err == nil {
		err = repo.db.Where("clip_id = ?", id).Delete(&ClipTag{}).Error
	}
	return err
}

func (repo *tagRepository) GetClipTag(clipId string) ([]Tag, error) {
	var tags []Tag
	err := repo.db.Select("tags.*").
		Joins("INNER JOIN clip_tags ON tags.id = clip_tags.tag_id").
		Where("clip_tags.clip_id = ?", clipId).
		Find(&tags).Error
	return tags, err
}

func (repo *tagRepository) AddTagToClip(clipId string, tagId string) (*ClipTag, error) {
	var now = time.Now().UTC()
	var clipTag = &ClipTag{
		ClipID:    uuid.MustParse(clipId),
		TagID:     uuid.MustParse(tagId),
		CreatedAt: &now,
	}
	err := repo.db.Create(
		clipTag,
	).Error
	return clipTag, err
}

func (repo *tagRepository) CreateNewTag(name string, userId string) (*Tag, error) {
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

func (repo *tagRepository) GetAllTag(userId string) ([]Tag, error) {
	var tags []Tag
	err := repo.db.Where("user_id = ?", userId).Find(&tags).Error
	return tags, err
}

func NewTagRepository(db *gorm.DB) TagRepository {
	return &tagRepository{
		db: db,
	}
}
