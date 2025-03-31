package auth

import (
	"net/mail"
	apperr "quira-api/pkg/app-err"
	appresponse "quira-api/pkg/app-response"

	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog"
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
	api := h.router.Group("/auth")
	api.Post("/sign-in", h.SignIn)
	api.Post("/sign-up", h.SignUp)
}

func (h *Handler) SignIn(c *fiber.Ctx) error {
	input := new(LoginInput)
	if err := c.BodyParser(input); err != nil {
		return apperr.FiberError(c, apperr.NewError(apperr.BadRequest, err))
	}
	if _, err := mail.ParseAddress(input.Email); err != nil {
		return apperr.FiberError(c, err)
	}
	token, err := h.service.Login(input)
	if err != nil {
		return apperr.FiberError(c, err)
	}

	return appresponse.FiberResponse(c, fiber.StatusOK, "User logged in successfully", token)
}

func (h *Handler) SignUp(c *fiber.Ctx) error {
	input := new(RegisterInput)
	if err := c.BodyParser(input); err != nil {
		return apperr.FiberError(c, err)
	}
	if _, err := mail.ParseAddress(input.Email); err != nil {
		return apperr.FiberError(c, err)
	}
	token, err := h.service.Register(input)
	if err != nil {
		return apperr.FiberError(c, err)
	}

	return appresponse.FiberResponse(c, fiber.StatusOK, "User registered in successfully", token)
}
