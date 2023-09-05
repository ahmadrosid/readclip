package util

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func ConnectToDatabase(dsn string) (*gorm.DB, error) {
	gormConfig := &gorm.Config{}
	gormConfig.Logger = logger.Default.LogMode(logger.Silent)
	if os.Getenv("ENABLE_LOG_SQL") == "true" {
		gormConfig = &gorm.Config{}
	}

	db, err := gorm.Open(postgres.Open(dsn), gormConfig)
	if err != nil {
		log.Printf("Failed to connect to the database: %v", err)
		return nil, err
	}
	fmt.Println("Connected to the database!")
	return db, nil
}
