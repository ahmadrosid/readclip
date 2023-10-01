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
func (repo *dbService) Create(user *User) (*User, error) {
	err := repo.db.Create(&user).Error
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
func (repo *dbService) FindByFirebaseID(firebaseID string) (*User, error) {
	user := &User{}
	err := repo.db.Find(user, "firebase_id", firebaseID).Error
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (repo *dbService) FindByID(id uuid.UUID) (*User, error) {
	user := &User{}
	err := repo.db.Find(user, "id", id).Error
	if err != nil {
		return nil, err
	}
	return user, nil
}

// Update implements UserRepository.
func (*dbService) Update(user *User) (*User, error) {
	panic("unimplemented")
}
