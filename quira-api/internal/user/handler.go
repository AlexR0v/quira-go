package user

import (
	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog"
	apperr "quira-api/pkg/app-err"
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
	api.Get("/", h.GetAllUsers)
	api.Get("/:id", h.GetUserById)
}

func (h *Handler) GetAllUsers(c *fiber.Ctx) error {
	size := c.QueryInt("size", 2)
	page := c.QueryInt("page", 1)
	users, err := h.service.GetAllUsers(size, (page-1)*size)
	if err != nil {
		return apperr.FiberError(c, err)
	}
	return appresponse.FiberResponse(c, fiber.StatusOK, "Users list", users)
}

func (h *Handler) GetUserById(c *fiber.Ctx) error {
	id := c.Params("id")
	userResponse, err := h.service.GetUserById(id)
	if err != nil {
		return apperr.FiberError(c, err)
	}
	return appresponse.FiberResponse(c, fiber.StatusOK, "User by id found", userResponse)
}
