package embedfile

import (
	"io"
	"net/http"
	"strings"
)

func ReplaceStrInFile(fs http.FileSystem, inputFilePath, oldStr, newStr string) (*string, error) {
	inputFile, err := fs.Open(inputFilePath)
	if err != nil {
		return nil, err
	}
	defer inputFile.Close()

	buffer := make([]byte, 1024)
	var builder strings.Builder

	for {
		n, err := inputFile.Read(buffer)
		if err != nil && err != io.EOF {
			return nil, err
		}

		if n == 0 {
			break
		}

		// Convert the chunk to a string and replace the old string with the new string
		chunkText := string(buffer[:n])
		modifiedChunk := strings.Replace(chunkText, oldStr, newStr, -1)

		// Write the modified chunk to the new file
		_, err = builder.WriteString(modifiedChunk)
		if err != nil {
			return nil, err
		}
	}

	result := builder.String()
	return &result, nil
}
