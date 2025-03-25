package home

import (
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
	api := h.router.Group("/api")
	api.Get("/", h.Index)
}

func (h *Handler) Index(ctx *fiber.Ctx) error {
	return ctx.SendString("Hello Home")
}
