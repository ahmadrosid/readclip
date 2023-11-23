package wiki

import "github.com/google/uuid"

type Wiki struct {
	ID          uuid.UUID              `gorm:"type:uuid;primary_key"`
	UserID      uuid.UUID              `gorm:"type:uuid"`
	Title       string                 `gorm:"type:varchar(255)"`
	Description string                 `gorm:"type:text"`
	Sidebar     map[string]interface{} `gorm:"type:jsonb"`
	Pages       []Page
}

type Page struct {
	ID     uuid.UUID `gorm:"type:uuid;primary_key"`
	WikiID uuid.UUID `gorm:"type:uuid;index"`
	Title  string    `gorm:"type:varchar(255)"`
	Body   string    `gorm:"type:text"`
}

type WikiRepository interface {
	Create(title string, description string, sidebar map[string]interface{}, userID uuid.UUID) (Wiki, error)
	Update(id string, newTitle string, newDescription string, newSidebar map[string]interface{}, userID uuid.UUID) (Wiki, error)
	Delete(id string, userID uuid.UUID) error
	Get(id string, userID uuid.UUID) (Wiki, error)
}
