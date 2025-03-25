package auth

import (
	"net/mail"
	
	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog"
)

type Handler struct {
	router fiber.Router
	log    *zerolog.Logger
}

func NewHandler(router fiber.Router, log *zerolog.Logger) {
	h := &Handler{
		router: router,
		log:    log,
	}
	api := h.router.Group("/auth")
	api.Post("/sign-in", h.SignIn)
	api.Post("/sign-up", h.SignIn)
}

func valid(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil
}

type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
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
	h.log.Info().Msgf("Email: %s, Password: %s", input.Email, input.Password)
	return c.Send(c.Body())
}

func (h *Handler) SignUp(ctx *fiber.Ctx) error {
	return ctx.SendString("Hello Home")
}
