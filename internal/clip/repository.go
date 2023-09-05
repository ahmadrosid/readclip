package clip

import (
	"gorm.io/gorm"
)

type dbService struct {
	db *gorm.DB
}

func NewClipRepository(db *gorm.DB) ClipRepository {
	return &dbService{db}
}

func (d *dbService) GetAllClipData(perPage int, offset int) ([]Clip, error) {
	var clips []Clip
	err := d.db.
		Select("id, url, title, hash_url, description, hostname, created_at").
		Limit(perPage).
		Offset(offset).
		Order("created_at DESC").
		Find(&clips).Error
	return clips, err
}

func (d *dbService) GetClipById(id string) (Clip, error) {
	var article Clip
	err := d.db.First(&article, "id = ?", id).Error
	return article, err
}

func (d *dbService) GetClipByHashUrl(hash_url string) (Clip, error) {
	var clip Clip
	err := d.db.First(&clip, "hash_url = ?", hash_url).Error
	return clip, err
}

func (d *dbService) CreateClip(clip Clip) error {
	err := d.db.Create(&clip).Error
	return err
}

func (d *dbService) DeleteClipByID(id string) error {
	err := d.db.Unscoped().Where("id = ?", id).Delete(&Clip{}).Error
	return err
}
