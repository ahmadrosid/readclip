package main

import (
	"fmt"

	"github.com/ahmadrosid/readclip/internal/clip"
	"github.com/ahmadrosid/readclip/internal/tag"
	"github.com/ahmadrosid/readclip/internal/util"
	"github.com/ahmadrosid/readclip/internal/util/config"
	"github.com/ahmadrosid/readclip/internal/util/openai"
	_ "github.com/lib/pq"
)

func main() {
	defaultUserId := "4e868d22-439a-4b62-87d1-eba963774bca"
	env := config.Load()
	db, err := util.ConnectToDatabase(env.DatabaseUrl)
	if err != nil {
		panic(err)
	}

	repo := clip.NewClipRepository(db)
	tagRepo := tag.NewTagRepository(db)
	clips, err := repo.GetAllUntaggedClips(defaultUserId)
	if err != nil {
		panic(err)
	}
	fmt.Println("got total untagged clips : " + fmt.Sprint(len(clips)))

	userTags, err := tagRepo.GetAllTag(defaultUserId)
	existingTags := make([]string, 0)
	for _, tag := range userTags {
		existingTags = append(existingTags, tag.Name)
	}
	if err != nil {
		panic(err)
	}
	fmt.Println("Total tags : " + fmt.Sprint(len(userTags)))

	for _, clip := range clips {
		tags, err := openai.AnalyzeContentForTags(clip.Content, existingTags)
		if err != nil {
			fmt.Println(err)
			continue
		}
		for _, tag := range userTags {
			for _, foundTag := range tags {
				if foundTag == tag.Name {
					fmt.Println("Assigning tag ['" + tag.Name + "'] to:  " + clip.Title)
					tagRepo.AddTagToClip(clip.Id.String(), tag.Id.String())
				}
			}
		}
	}
}
