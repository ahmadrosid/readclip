package main

import (
	"fmt"
	"strconv"

	"github.com/ahmadrosid/readclip/internal/clip"
	"github.com/ahmadrosid/readclip/internal/tag"
	"github.com/ahmadrosid/readclip/internal/util"
	"github.com/ahmadrosid/readclip/internal/util/config"
	"github.com/ahmadrosid/readclip/internal/util/upstash"
	_ "github.com/lib/pq"
	"github.com/milosgajdos/go-embeddings/document/text"
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
	if err != nil {
		panic(err)
	}

	existingTags := make([]string, 0)
	for _, tag := range userTags {
		existingTags = append(existingTags, tag.Name)
	}
	if err != nil {
		panic(err)
	}
	fmt.Println("Total tags : " + fmt.Sprint(len(userTags)))

	index := 0
	chunks := make([]upstash.VectorData, 0)
	for _, clip := range clips {
		index++
		println("url: " + clip.Url)
		s := text.NewSplitter().
			WithChunkSize(200).
			WithChunkOverlap(10).
			WithTrimSpace(true).
			WithKeepSep(true)

		rs := text.NewRecursiveCharSplitter().
			WithSplitter(s)

		splits := rs.Split(string(clip.Content))

		chunk := 0
		for i, s := range splits {
			chunks = append(chunks, upstash.VectorData{
				Id:     clip.Id.String() + "_" + strconv.Itoa(i),
				UserId: defaultUserId,
				Data:   s,
			})
			chunk++
			if chunk >= 10 {
				fmt.Println("Indexing start at: ", i, s)
				chunk = 0
				upstash.InsertVectorData(env.Uptash, chunks)
				chunks = make([]upstash.VectorData, 0)
			}
			fmt.Println(i, s)
		}

		if len(chunks) > 0 {
			upstash.InsertVectorData(env.Uptash, chunks)
			chunks = make([]upstash.VectorData, 0)
		}

		break
	}
}
