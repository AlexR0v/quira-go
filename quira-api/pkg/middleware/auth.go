package middleware

import (
	"errors"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	apperr "quira-api/pkg/app-err"
)

func AuthMiddleware(store *session.Store) fiber.Handler {
	return func(ctx *fiber.Ctx) error {

		sess, err := store.Get(ctx)
		if err != nil {
			panic(err)
		}
		userEmail := ""
		if email, ok := sess.Get("email").(string); ok {
			userEmail = email
		}
		if userEmail == "" {
			return apperr.FiberError(ctx, apperr.NewError(apperr.Unauthorized, errors.New("StatusUnauthorized")))
		}
		ctx.Locals("email", userEmail)
		return ctx.Next()
	}
}
