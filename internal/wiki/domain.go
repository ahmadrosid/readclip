package wiki

import (
	"database/sql/driver"
	"encoding/json"
	"errors"

	"github.com/google/uuid"
)

type Wiki struct {
	ID          uuid.UUID  `gorm:"type:uuid;primary_key" json:"id"`
	UserID      uuid.UUID  `gorm:"type:uuid" json:"user_id"`
	Title       string     `gorm:"type:varchar(255)" json:"title"`
	Description string     `gorm:"type:text" json:"description"`
	Sidebar     SidebarMap `gorm:"type:jsonb" json:"sidebar"`
	Pages       []Page     `json:"pages"`
}

type SidebarMap map[string]interface{}

func (s SidebarMap) Value() (driver.Value, error) {
	return json.Marshal(s)
}

func (s *SidebarMap) Scan(value interface{}) error {
	b, ok := value.([]byte)
	if !ok {
		return errors.New("Scan error: expected a []byte")
	}

	var m map[string]interface{}
	err := json.Unmarshal(b, &m)
	if err != nil {
		return err
	}

	*s = SidebarMap(m)
	return nil
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
	GetByUserID(userID uuid.UUID) (Wiki, error)
}
