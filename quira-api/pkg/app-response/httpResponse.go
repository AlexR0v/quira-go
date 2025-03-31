package app_response

import (
	"github.com/gofiber/fiber/v2"
)

func FiberResponse(c *fiber.Ctx, status int, message string, data any) error {
	return c.Status(status).JSON(fiber.Map{
		"status":  "success",
		"message": message,
		"data":    data,
	})
}
