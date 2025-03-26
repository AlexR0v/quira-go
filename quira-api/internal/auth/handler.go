package auth

import (
	"net/mail"

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
		return c.Status(fiber.StatusBadRequest).JSON(
			fiber.Map{
				"status":  "error",
				"message": "Error on login request",
				"errors":  err.Error(),
			},
		)
	}
	if _, err := mail.ParseAddress(input.Email); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			fiber.Map{
				"status":  "error",
				"message": "Error on login request",
				"errors":  err.Error(),
			},
		)
	}
	token, err := h.service.Login(input)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			fiber.Map{
				"status":  "error",
				"message": err.Error(),
				"errors":  err.Error(),
			},
		)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":  "success",
		"message": "User logged in successfully",
		"token":   token,
	})
}

func (h *Handler) SignUp(c *fiber.Ctx) error {
	input := new(RegisterInput)
	if err := c.BodyParser(input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			fiber.Map{
				"status":  "error",
				"message": "Error on login request",
				"errors":  err.Error(),
			},
		)
	}
	if _, err := mail.ParseAddress(input.Email); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			fiber.Map{
				"status":  "error",
				"message": "Error on login request",
				"errors":  err.Error(),
			},
		)
	}
	token, err := h.service.Register(input)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			fiber.Map{
				"status":  "error",
				"message": err.Error(),
				"errors":  err.Error(),
			},
		)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":  "success",
		"message": "User registered in successfully",
		"token":   token,
	})
}
