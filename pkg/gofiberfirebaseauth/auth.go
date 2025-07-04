// 🚀 Fiber is an Express inspired web framework written in Go with 💖
// 📌 API Documentation: https://fiber.wiki
// 📝 Github Repository: https://github.com/gofiber/fiber
// Special thanks to : https://github.com/LeafyCode/express-firebase-auth

package gofiberfirebaseauth

import (
	"errors"

	"github.com/gofiber/fiber/v2"
)

// New - Signature Function
func New(config Config) fiber.Handler {
	// Init config
	cfg := configDefault(config)
	// Return authed handler
	return func(c *fiber.Ctx) error {

		// Don't execute middleware if Next returns true
		if cfg.Next != nil && cfg.Next(c) {
			return c.Next()
		}
		// 1) Construct the url to compare
		url := c.Method() + "::" + c.Path()

		// Experimental :: IF url contain any parms or querry
		// if c.Path() != c.OriginalURL() {
		// 	r := c.Route()
		// 	fmt.Println(r.Method, r.Path, r.Params, r.Handlers)
		// 	url = r.Method + "::" + r.Path
		// }

		// 2) If url is ignored return to Next middleware
		if cfg.IgnoreUrls != nil && len(cfg.IgnoreUrls) > 0 {
			for i := range cfg.IgnoreUrls {
				if cfg.IgnoreUrls[i] == url {
					return c.Next()
				}
			}
		}

		// 3) Get token from header
		IDToken := c.Get(fiber.HeaderAuthorization)
		// Validate token
		if len(IDToken) == 0 {
			return cfg.ErrorHandler(c, errors.New("Missing Token"))
		}

		// 4) Validate the IdToken
		token, err := cfg.Authorizer(IDToken, url)
		// IF error return error handler
		if err != nil {
			return cfg.ErrorHandler(c, err)
		}

		// 5) IF IdToken valid return SucessHandler
		if token != nil {
			// Set authenticated user data into local context
			c.Locals(cfg.ContextKey, User{
				Name:          token.Claims["name"].(string),
				Email:         token.Claims["email"].(string),
				EmailVerified: token.Claims["email_verified"].(bool),
				UserID:        token.Claims["user_id"].(string),
			})

			return cfg.SuccessHandler(c)
		}
		// 6) Else IF return error
		return cfg.ErrorHandler(c, err)
	}
}
