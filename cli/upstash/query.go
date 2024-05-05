package main

import (
	"github.com/ahmadrosid/readclip/internal/util/config"
	"github.com/ahmadrosid/readclip/internal/util/upstash"
	_ "github.com/lib/pq"
)

func main() {
	env := config.Load()
	// res, err := upstash.SearchVectorData(env.Uptash, "Free")
	// if err != nil {
	// 	panic(err)
	// }

	// for _, v := range res {
	// 	fmt.Println(v.Id, v.Data)
	// }

	index := upstash.GetIndex(env.Uptash)
	index.Reset()
	// info, err := index.Info()
	// if err != nil {
	// 	panic(err)
	// }
	// strOutput, err := json.MarshalIndent(info, "", "  ")
	// if err != nil {
	// 	panic(err)
	// }
	// fmt.Println(string(strOutput))

}
