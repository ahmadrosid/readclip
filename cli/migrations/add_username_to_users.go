package main

import (
	"fmt"
	"os"

	"github.com/ahmadrosid/readclip/internal/user"
	"github.com/ahmadrosid/readclip/internal/util"
	"github.com/joho/godotenv"
)

var (
	defaultUserId = "4e868d22-439a-4b62-87d1-eba963774bca"
)

func main() {
	godotenv.Load()

	connStr := os.Getenv("DB_CONNECTION_STRING")
	if connStr == "" {
		println("DB_CONNECTION_STRING is empty")
	}

	db, _ := util.ConnectToDatabase(connStr)
	db.AutoMigrate(&user.User{})
	fmt.Println("Migration completed")
}
