package openai

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestAnalyzeContentForTags(t *testing.T) {
	content := "This is a test content about technology and innovation."
	existingTags := []string{"tech", "news", "ai"}

	// Execute
	tags, err := AnalyzeContentForTags(content, existingTags)
	fmt.Printf("Tags: %+v\n", tags)

	// Verify
	assert.NoError(t, err)
	assert.NotNil(t, tags)
	assert.Contains(t, tags, "tech")
	assert.NotContains(t, tags, "ai")
}
