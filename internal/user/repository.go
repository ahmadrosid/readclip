package user

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type dbService struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &dbService{db}
}

// Create implements UserRepository.
func (d *dbService) Create(user *User) (*User, error) {
	err := d.db.Create(&user).Error
	if err != nil {
		return nil, err
	}
	return user, nil
}

// Delete implements UserRepository.
func (*dbService) Delete(id uuid.UUID) error {
	panic("unimplemented")
}

// FindByFirebaseID implements UserRepository.
func (*dbService) FindByFirebaseID(firebaseID string) (*User, error) {
	panic("unimplemented")
}

// FindByID implements UserRepository.
func (*dbService) FindByID(id uuid.UUID) (*User, error) {
	panic("unimplemented")
}

// Update implements UserRepository.
func (*dbService) Update(user *User) (*User, error) {
	panic("unimplemented")
}
