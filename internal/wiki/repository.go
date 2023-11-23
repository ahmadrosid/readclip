package wiki

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type wikipository struct {
	db *gorm.DB
}

func (repo *wikipository) Create(title string, description string, sidebar map[string]interface{}, userID uuid.UUID) (Wiki, error) {
	wiki := Wiki{
		ID:          uuid.New(),
		UserID:      userID,
		Title:       title,
		Description: description,
		Sidebar:     sidebar,
	}

	err := repo.db.Create(&wiki).Error
	return wiki, err
}

func (repo *wikipository) Delete(id string, userID uuid.UUID) error {
	err := repo.db.Where("id = ?", id).Where("user_id = ?", userID).Delete(&Wiki{}).Error
	return err
}

func (repo *wikipository) Get(id string, userID uuid.UUID) (Wiki, error) {
	var wiki Wiki
	err := repo.db.Where("id = ?", id).Where("user_id = ?", userID).First(&wiki).Error
	return wiki, err
}

func (repo *wikipository) Update(id string, newTitle string, newDescription string, newSidebar map[string]interface{}, userID uuid.UUID) (Wiki, error) {
	var wiki Wiki
	err := repo.db.Where("id = ?", id).Where("user_id = ?", userID).First(&wiki).Error
	if err != nil {
		return wiki, err
	}

	wiki.Title = newTitle
	wiki.Description = newDescription
	wiki.Sidebar = newSidebar

	err = repo.db.Save(&wiki).Error
	return wiki, err
}

func NewWikiRepository(db *gorm.DB) WikiRepository {
	return &wikipository{db}
}
