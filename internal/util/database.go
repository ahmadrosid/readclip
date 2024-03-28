package util

import (
	"os"

	"database/sql"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func ConnectToDatabase(dsn string) (*gorm.DB, error) {
	gormConfig := &gorm.Config{
		TranslateError: true,
	}
	gormConfig.Logger = logger.Default.LogMode(logger.Silent)
	if os.Getenv("ENABLE_LOG_SQL") == "true" {
		gormConfig = &gorm.Config{
			TranslateError: true,
		}
	}

	sqlDB, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}

	pgConf := postgres.Config{Conn: sqlDB}
	db, err := gorm.Open(postgres.New(pgConf), gormConfig)
	if err != nil {
		return nil, err
	}
	return db, nil
}
