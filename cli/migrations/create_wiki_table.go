package main

import (
	"fmt"
	"os"

	"github.com/ahmadrosid/readclip/internal/util"
	"github.com/ahmadrosid/readclip/internal/wiki"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	connStr := os.Getenv("DB_CONNECTION_STRING")
	if connStr == "" {
		println("DB_CONNECTION_STRING is empty")
	}

	db, _ := util.ConnectToDatabase(connStr)
	db.AutoMigrate(&wiki.Wiki{})
	db.AutoMigrate(&wiki.Page{})
	fmt.Println("Migration completed")
}
