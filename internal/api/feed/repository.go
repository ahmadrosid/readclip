package feed

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type feedRepository struct {
	db *gorm.DB
}

func NewFeedRepository(db *gorm.DB) FeedRepository {
	return &feedRepository{db}
}

func (repo *feedRepository) CreateFeed(feed Feed) (Feed, error) {
	err := repo.db.Create(&feed).Error
	return feed, err
}

func (repo *feedRepository) DeleteFeedByID(id string, userID uuid.UUID) error {
	return repo.db.Unscoped().
		Where("id = ?", id).
		Where("user_id = ?", userID).
		Delete(&Feed{}).Error
}

func (repo *feedRepository) UpdateFeed(feed Feed) error {
	return repo.db.Save(feed).Error
}

func (repo *feedRepository) GetFeedById(id string, userID uuid.UUID) (Feed, error) {
	var feed Feed
	err := repo.db.Where("id = ?", id).Where("user_id = ?", userID).First(&feed).Error
	return feed, err
}
