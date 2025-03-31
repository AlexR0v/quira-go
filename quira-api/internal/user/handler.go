package user

import (
	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog"
	app_err "quira-api/pkg/app-err"
	appresponse "quira-api/pkg/app-response"
)

type Handler struct {
	router  fiber.Router
	log     *zerolog.Logger
	service *Service
}

func NewHandler(router fiber.Router, log *zerolog.Logger, service *Service) {
	h := &Handler{
		router:  router,
		log:     log,
		service: service,
	}
	api := h.router.Group("/users")
	api.Get("/getAll", h.GetAllUsers)
}

func (h *Handler) GetAllUsers(c *fiber.Ctx) error {
	users, err := h.service.GetAllUsers()
	if err != nil {
		return app_err.FiberError(c, err)
	}
	return appresponse.FiberResponse(c, fiber.StatusOK, "User registered in successfully", users)
}
