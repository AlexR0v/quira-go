package cors_app

import (
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func SetCors() cors.Config {
	return cors.Config{
		AllowOrigins:     "http://localhost:5173/",
		AllowMethods:     "GET, POST, PUT, DELETE, PATCH, OPTIONS",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
	}
}
