package main

import (
	"github.com/gofiber/contrib/fiberzerolog"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/favicon"
	"github.com/gofiber/fiber/v2/middleware/recover"
	
	"quira-api/internal/auth"
	"quira-api/internal/home"
	"quira-api/internal/pages"
	"quira-api/pkg/config"
	corsapp "quira-api/pkg/cors-app"
	"quira-api/pkg/logger"
)

func main() {
	env := config.LoadEnv()
	app := fiber.New()
	log := logger.NewLogger(&env.Log)
	
	app.Use(cors.New(corsapp.SetCors()))
	app.Use(fiberzerolog.New(fiberzerolog.Config{Logger: log}))
	app.Use(recover.New())
	app.Use(favicon.New())
	
	auth.NewHandler(app, log)
	home.NewHandler(app, log)
	pages.NewHandler(app, log)
	
	err := app.Listen(":9000")
	if err != nil {
		log.Fatal().Msg(err.Error())
		return
	}
}
