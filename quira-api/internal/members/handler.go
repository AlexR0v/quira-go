package members

import (
	"errors"
	"fmt"
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
	api := h.router.Group("/members")
	api.Post("/join", h.Join)
}

func (h *Handler) Join(c *fiber.Ctx) error {
	input := new(InputJoin)
	if err := c.BodyParser(input); err != nil {
		return apperr.FiberError(c, err)
	}
	userId, ok := c.Locals("userId").(string)
	fmt.Println(userId)
	if !ok {
		return apperr.FiberError(c, apperr.NewError(apperr.UserExists, errors.New("userId not found in context")))
	}
	workspace, err := h.service.Join(input, userId)
	if err != nil {
		return apperr.FiberError(c, err)
	}
	return appresponse.FiberResponse(c, fiber.StatusOK, "workspace", workspace)
}
