package firebase

import (
	"context"
	"fmt"

	firebase "firebase.google.com/go"
	"github.com/ahmadrosid/readclip/internal/config"

	"google.golang.org/api/option"
)

func NewFirebaseApp(ctx context.Context, env config.Config) (*firebase.App, error) {
	credentials, err := env.GoogleCredentialsJson()
	if err != nil {
		return nil, fmt.Errorf("error parse credentials: %v", err)
	}

	opt := option.WithCredentialsJSON(credentials)
	app, err := firebase.NewApp(ctx, nil, opt)
	if err != nil {
		return nil, fmt.Errorf("error initializing app: %v", err)
	}

	return app, nil
}
