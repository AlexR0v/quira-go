package middleware

import (
	"errors"
	"strconv"

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
		userIdApp := int64(0)
		if email, ok := sess.Get("email").(string); ok {
			userEmail = email
		}
		if userId, ok := sess.Get("userId").(int64); ok {
			userIdApp = userId
		}
		if userEmail == "" || userIdApp == 0 {
			return apperr.FiberError(ctx, apperr.NewError(apperr.Unauthorized, errors.New("StatusUnauthorized")))
		}
		ctx.Locals("email", userEmail)
		ctx.Locals("userId", strconv.FormatInt(userIdApp, 10))
		return ctx.Next()
	}
}
