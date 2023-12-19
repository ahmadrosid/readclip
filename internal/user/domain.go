package user

import (
	"time"

	"github.com/google/uuid"
)

type InputRegister struct {
	Name string
}

type User struct {
	ID         uuid.UUID  `gorm:"primary_key;type:uuid;default:uuid_generate_v4()"`
	Name       string     `gorm:"size:255"`
	Username   *string    `gorm:"size:255;unique"`
	Email      string     `gorm:"size:255;unique"`
	FirebaseID string     `gorm:"size:255;unique"`
	CreatedAt  *time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt  *time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	DeletedAt  *time.Time
}

type UserRepository interface {
	FindByID(id uuid.UUID) (*User, error)
	FindByFirebaseID(firebaseID string) (*User, error)
	Create(user *User) (*User, error)
	Update(user *User) (*User, error)
	UpdateUsername(user *User, username string) (*User, error)
	Delete(id uuid.UUID) error
}
