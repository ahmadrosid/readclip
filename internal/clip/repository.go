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

func (d *dbService) GetAllClipData(perPage int, offset int, tagId string, userID uuid.UUID) ([]Clip, error) {
	var clips []Clip
	query := d.db.
		Select("clips.id, clips.url, clips.title, clips.hash_url, clips.description, clips.hostname, clips.created_at").
		Where("clips.user_id = ?", userID)
	if tagId != "" {
		query = query.Joins("INNER JOIN clip_tags ON clips.id = clip_tags.clip_id").Where("clip_tags.tag_id = ?", tagId)
	}
	err := query.
		Limit(perPage).
		Offset(offset).
		Order("clips.created_at DESC").
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
	err := d.db.Where("user_id = ?", userID).First(&clip, "hash_url = ?", hash_url).Error
	return clip, err
}

func (d *dbService) CreateClip(clip Clip) (Clip, error) {
	err := d.db.Create(&clip).Error
	return clip, err
}

func (d *dbService) DeleteClipByID(id string, userID uuid.UUID) error {
	err := d.db.Unscoped().Where("id = ?", id).Where("user_id = ?", userID).Delete(&Clip{}).Error
	return err
}
