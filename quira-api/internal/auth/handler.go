package auth

import (
	"net/mail"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/gofiber/storage/postgres/v3"
	"github.com/rs/zerolog"

	apperr "quira-api/pkg/app-err"
	appresponse "quira-api/pkg/app-response"
)

type Handler struct {
	router  fiber.Router
	log     *zerolog.Logger
	service *Service
	session *session.Store
	storage *postgres.Storage
}

func NewHandler(
	router fiber.Router,
	log *zerolog.Logger,
	service *Service,
	sess *session.Store,
	storage *postgres.Storage,
) {
	h := &Handler{
		router:  router,
		log:     log,
		service: service,
		session: sess,
		storage: storage,
	}
	api := h.router.Group("/auth")
	api.Post("/sign-in", h.SignIn)
	api.Post("/sign-up", h.SignUp)
	api.Get("/logout", h.Logout)
}

func (h *Handler) SignIn(c *fiber.Ctx) error {
	input := new(LoginInput)
	if err := c.BodyParser(input); err != nil {
		return apperr.FiberError(c, apperr.NewError(apperr.BadRequest, err))
	}
	if _, err := mail.ParseAddress(input.Email); err != nil {
		return apperr.FiberError(c, err)
	}
	user, err := h.service.Login(input)
	if err != nil {
		return apperr.FiberError(c, err)
	}

	sess, err := h.session.Get(c)
	if err != nil {
		return apperr.FiberError(c, apperr.NewError(apperr.InternalServerError, err))
	}
	sess.Set("email", user.Email)
	sess.Set("userId", user.ID)
	if err := sess.Save(); err != nil {
		return apperr.FiberError(c, apperr.NewError(apperr.InternalServerError, err))
	}
	return appresponse.FiberResponse(c, fiber.StatusOK, "User logged in successfully", "")
}

func (h *Handler) SignUp(c *fiber.Ctx) error {
	input := new(RegisterInput)
	if err := c.BodyParser(input); err != nil {
		return apperr.FiberError(c, err)
	}
	if _, err := mail.ParseAddress(input.Email); err != nil {
		return apperr.FiberError(c, err)
	}
	user, err := h.service.Register(input)
	if err != nil {
		return apperr.FiberError(c, err)
	}

	sess, err := h.session.Get(c)
	if err != nil {
		return apperr.FiberError(c, apperr.NewError(apperr.InternalServerError, err))
	}
	sess.Set("email", user.Email)
	sess.Set("userId", user.ID)
	if err := sess.Save(); err != nil {
		return apperr.FiberError(c, apperr.NewError(apperr.InternalServerError, err))
	}

	return appresponse.FiberResponse(c, fiber.StatusOK, "User registered in successfully", "")
}

func (h *Handler) Logout(c *fiber.Ctx) error {
	sess, err := h.session.Get(c)
	if err != nil {
		return apperr.FiberError(c, apperr.NewError(apperr.InternalServerError, err))
	}
	err = h.storage.Delete(sess.ID())
	if err != nil {
		return apperr.FiberError(c, apperr.NewError(apperr.InternalServerError, err))
	}
	errD := sess.Destroy()
	if errD != nil {
		return apperr.FiberError(c, apperr.NewError(apperr.InternalServerError, errD))
	}
	sess.Delete("email")
	if err := sess.Save(); err != nil {
		return apperr.FiberError(c, apperr.NewError(apperr.InternalServerError, err))
	}
	return appresponse.FiberResponse(c, fiber.StatusOK, "User logout successfully", "")
}
