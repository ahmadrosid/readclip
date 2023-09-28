package main

import (
	"os"

	"github.com/ahmadrosid/readclip/internal/clip"
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

	var clips []clip.Clip
	err := db.Find(&clips).Error
	if err != nil {
		panic(err)
	}

	for _, c := range clips {
		println("updating: ", c.Id.String())
		// update clips add user id with default user id
		err = db.Model(&c).Update("user_id", defaultUserId).Error
		if err != nil {
			panic(err)
		}
	}
}
