package main

import (
	"time"

	"github.com/gofiber/contrib/fiberzerolog"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/favicon"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/gofiber/storage/postgres/v3"

	"quira-api/internal/auth"
	"quira-api/internal/user"
	"quira-api/internal/workspaces"
	"quira-api/pkg/config"
	corsapp "quira-api/pkg/cors-app"
	"quira-api/pkg/db"
	"quira-api/pkg/logger"
	"quira-api/pkg/middleware"
)

func main() {
	env := config.LoadEnv()
	app := fiber.New()
	log := logger.NewLogger(&env.Log)

	// DB
	dbPool := db.CreateDBPool(&env.DB, log)
	defer dbPool.Close()

	storage := postgres.New(
		postgres.Config{
			DB:         dbPool,
			Table:      "sessions",
			Reset:      false,
			GCInterval: 10 * time.Second,
		},
	)
	sessionApp := session.New(
		session.Config{
			Storage:    storage,
			Expiration: time.Hour * 24 * 7,
		},
	)

	// Middlewares
	app.Use(cors.New(corsapp.SetCors()))
	app.Use(fiberzerolog.New(fiberzerolog.Config{Logger: log}))
	app.Use(recover.New())
	app.Use(favicon.New())

	// Repositories
	userRepo := user.NewRepository(dbPool, log)
	workspaceRepo := workspaces.NewRepository(dbPool, log)

	// Services
	authService := auth.NewService(userRepo, log)
	userService := user.NewService(userRepo, log)
	workspaceService := workspaces.NewService(workspaceRepo, log)

	// Handlers
	auth.NewHandler(app, log, authService, sessionApp, storage)

	app.Use(middleware.AuthMiddleware(sessionApp))
	user.NewHandler(app, log, userService)
	workspaces.NewHandler(app, log, workspaceService)

	err := app.Listen(":9000")
	if err != nil {
		log.Fatal().Msg(err.Error())
		return
	}
}
