package clip

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/ahmadrosid/readclip/internal/tag"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type clipRepository struct {
	db *gorm.DB
}

func NewClipRepository(db *gorm.DB) ClipRepository {
	return &clipRepository{db}
}

func (repo *clipRepository) GetAllClipData(perPage int, offset int, tagId string, userID uuid.UUID) ([]Clip, error) {
	var clips []Clip
	query := repo.db.
		Select("clips.id, clips.url, clips.title, clips.hash_url, clips.description, clips.hostname, clips.user_id, clips.created_at").
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

func (repo *clipRepository) GetClipById(id string, userID uuid.UUID) (Clip, error) {
	var article Clip
	err := repo.db.Where("id = ?", id).Where("user_id = ?", userID).First(&article).Error
	return article, err
}

func (repo *clipRepository) GetClipByHashUrl(hash_url string, userID uuid.UUID) (Clip, error) {
	var clip Clip
	err := repo.db.Where("user_id = ?", userID).Where("hash_url = ?", hash_url).First(&clip).Error
	return clip, err
}

func (repo *clipRepository) CreateClip(clip Clip) (Clip, error) {
	err := repo.db.Create(&clip).Error
	return clip, err
}

func (repo *clipRepository) DeleteClipByID(id string, userID uuid.UUID) error {
	err := repo.db.Unscoped().Where("id = ?", id).Where("user_id = ?", userID).Delete(&Clip{}).Error
	return err
}

func (repo *clipRepository) UpdateSummaryByID(id string, userID uuid.UUID, summary string) error {
	err := repo.db.Unscoped().Model(&Clip{}).Where("id = ?", id).Where("user_id = ?", userID).Update("summary", summary).Error
	return err
}

func (repo *clipRepository) ExportClips(format string, userID uuid.UUID) (string, error) {
	var clips []Clip
	err := repo.db.Where("user_id = ?", userID).Find(&clips).Error
	if err != nil {
		return "", err
	}

	if len(clips) == 0 {
		return "", nil
	}

	var tags []tag.Tag
	err = repo.db.Where("user_id = ?", userID).Find(&tags).Error
	if err != nil {
		return "", err
	}

	var clipTags []tag.ClipTag
	err = repo.db.Find(&clipTags).Error
	if err != nil {
		return "", err
	}

	tagMap := make(map[uuid.UUID][]tag.Tag)
	for _, tag := range tags {
		tagMap[tag.Id] = append(tagMap[tag.Id], tag)
	}

	getTags := func(clipId uuid.UUID) string {
		tagIds := make([]uuid.UUID, 0)
		for _, tag := range clipTags {
			if tag.ClipID == clipId {
				tagIds = append(tagIds, tag.TagID)
			}
		}
		if len(tagIds) == 0 {
			return ""
		}

		var tagsString []string
		for _, tagId := range tagIds {
			for _, tag := range tagMap[tagId] {
				tagsString = append(tagsString, tag.Name)
			}
		}

		return strings.Join(tagsString, ",")
	}

	escapeForCSV := func(data string) string {
		data = strings.Replace(data, "\"", "\"\"", -1)
		if strings.ContainsAny(data, ",\n\"") {
			data = "\"" + data + "\""
		}
		return data
	}

	if format == "csv" {
		var builder strings.Builder
		builder.WriteString("url,title,description,hostname,tags,created_at,content\n")

		for _, clip := range clips {
			row := fmt.Sprintf("%s,%s,%s,%s,%s,%s,%s\n",
				escapeForCSV(clip.Url),
				escapeForCSV(clip.Title),
				escapeForCSV(clip.Description),
				escapeForCSV(clip.Hostname),
				escapeForCSV(getTags(clip.Id)),
				escapeForCSV(clip.CreatedAt.String()),
				escapeForCSV(clip.Content))

			builder.WriteString(row)
		}

		return builder.String(), nil
	}

	data := make([]fiber.Map, 0)
	for _, clip := range clips {
		data = append(data, fiber.Map{
			"url":         clip.Url,
			"title":       clip.Title,
			"description": clip.Description,
			"content":     clip.Content,
			"hostname":    clip.Hostname,
			"tags":        getTags(clip.Id),
			"created_at":  clip.CreatedAt.String(),
		})
	}

	jsonString, err := json.Marshal(data)
	return string(jsonString), err
}
