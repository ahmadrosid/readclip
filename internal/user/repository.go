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

func (repo *dbService) Create(user *User) (*User, error) {
	err := repo.db.Create(&user).Error
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (repo *dbService) Delete(id uuid.UUID) error {
	println("Delete user, user_id: ", id.String())
	err := repo.db.Delete(&User{}, "id", id).Error
	if err == nil {
		println("Delete tag, user_id: ", id.String())
		type Tag struct{}
		err = repo.db.Delete(&Tag{}, "user_id", id).Error
	}
	if err == nil {
		println("Delete clip, user_id: ", id.String())
		type Clip struct{}
		err = repo.db.Delete(&Clip{}, "user_id", id).Error
	}
	return err
}

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

func (repo *dbService) Update(user *User) (*User, error) {
	err := repo.db.Save(user).Error
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (repo *dbService) UpdateUsername(user *User, username string) (*User, error) {
	user.Username = username
	err := repo.db.Save(&user).Error
	if err != nil {
		return nil, err
	}
	return user, nil
}
