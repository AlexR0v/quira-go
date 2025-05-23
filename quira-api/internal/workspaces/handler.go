package workspaces

import (
	"errors"
	
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
	api := h.router.Group("/workspaces")
	api.Get("/", h.GetAll)
	api.Post("/", h.Create)
	api.Patch("/", h.Update)
	api.Get("/:id", h.GetById)
	api.Get("/:id/analytics", h.Analytics)
	api.Delete("/:id", h.DeleteById)
}

func (h *Handler) GetAll(c *fiber.Ctx) error {
	size := c.QueryInt("size", 20)
	page := c.QueryInt("page", 1)
	userId, ok := c.Locals("userId").(string)
	if !ok {
		return apperr.FiberError(c, apperr.NewError(apperr.BadRequest, errors.New("userId not found in context")))
	}
	users, err := h.service.GetAll(size, (page-1)*size, userId)
	if err != nil {
		return apperr.FiberError(c, err)
	}
	return appresponse.FiberResponse(c, fiber.StatusOK, "Workspaces list", users)
}

func (h *Handler) GetById(c *fiber.Ctx) error {
	id := c.Params("id")
	res, err := h.service.GetById(id)
	if err != nil {
		return apperr.FiberError(c, err)
	}
	return appresponse.FiberResponse(c, fiber.StatusOK, "Workspace by id found", res)
}

func (h *Handler) Create(c *fiber.Ctx) error {
	userId, ok := c.Locals("userId").(string)
	if !ok {
		return apperr.FiberError(c, apperr.NewError(apperr.BadRequest, errors.New("userId not found in context")))
	}
	input := new(CreateInput)
	if err := c.BodyParser(input); err != nil {
		return apperr.FiberError(c, err)
	}
	workspace, err := h.service.Create(input, userId)
	if err != nil {
		return apperr.FiberError(c, err)
	}
	return appresponse.FiberResponse(c, fiber.StatusOK, "New Workspace", workspace)
}

func (h *Handler) DeleteById(c *fiber.Ctx) error {
	id := c.Params("id")
	err := h.service.DeleteById(id)
	if err != nil {
		return apperr.FiberError(c, err)
	}
	return appresponse.FiberResponse(c, fiber.StatusOK, "Workspace by id deleted", "deleted")
}

func (h *Handler) Update(c *fiber.Ctx) error {
	input := new(UpdateInput)
	if err := c.BodyParser(input); err != nil {
		return apperr.FiberError(c, err)
	}
	workspace, err := h.service.Update(input)
	if err != nil {
		return apperr.FiberError(c, err)
	}
	return appresponse.FiberResponse(c, fiber.StatusOK, "Update Workspace", workspace)
}

func (h *Handler) Analytics(c *fiber.Ctx) error {
	id := c.Params("id")
	userId, ok := c.Locals("userId").(string)
	if !ok {
		return apperr.FiberError(c, apperr.NewError(apperr.BadRequest, errors.New("userId not found in context")))
	}
	analytics := h.service.GetAnalytics(id, userId)
	return appresponse.FiberResponse(c, fiber.StatusOK, "analytics", analytics)
}
