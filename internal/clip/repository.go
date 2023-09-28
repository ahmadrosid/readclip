package clip

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type dbService struct {
	db *gorm.DB
}

func NewClipRepository(db *gorm.DB) ClipRepository {
	return &dbService{db}
}

func (d *dbService) GetAllClipData(perPage int, offset int, userID uuid.UUID) ([]Clip, error) {
	var clips []Clip
	err := d.db.
		Select("id, url, title, hash_url, description, hostname, created_at").
		Where("user_id = ?", userID).
		Limit(perPage).
		Offset(offset).
		Order("created_at DESC").
		Find(&clips).Error
	return clips, err
}

func (d *dbService) GetClipById(id string, userID uuid.UUID) (Clip, error) {
	var article Clip
	err := d.db.First(&article, "id = ?", id, "user_id = ?", userID).Error
	return article, err
}

func (d *dbService) GetClipByHashUrl(hash_url string, userID uuid.UUID) (Clip, error) {
	var clip Clip
	err := d.db.First(&clip, "hash_url = ?", hash_url, "user_id = ?", userID).Error
	return clip, err
}

func (d *dbService) CreateClip(clip Clip) error {
	err := d.db.Create(&clip).Error
	return err
}

func (d *dbService) DeleteClipByID(id string, userID uuid.UUID) error {
	err := d.db.Unscoped().Where("id = ?", id, "user_id = ?", userID).Delete(&Clip{}).Error
	return err
}
