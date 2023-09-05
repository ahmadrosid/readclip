package main

import (
	"os"

	"github.com/ahmadrosid/readclip/internal/clip"
	"github.com/ahmadrosid/readclip/internal/util"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	connStr := os.Getenv("DB_CONNECTION_STRING")
	if connStr == "" {
		println("DB_CONNECTION_STRING is empty")
	}

	db, _ := util.ConnectToDatabase(connStr)
	db.AutoMigrate(&clip.Clip{})

	var clips []clip.Clip
	err := db.Order("created_at DESC").Where("hostname != ''").Find(&clips).Error
	if err != nil {
		panic(err)
	}

	for _, item := range clips {
		hostname, err := util.GetHostname(item.Url)
		if err != nil {
			println(err.Error())
			continue
		}
		item.Hostname = hostname
		db.Save(&item)
	}
}
