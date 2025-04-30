package projects

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
	api := h.router.Group("/:workspaceId/projects")
	api.Get("/", h.GetAll)
	api.Post("/", h.Create)
	api.Patch("/", h.Update)
	api.Get("/:id", h.GetById)
	api.Delete("/:id", h.DeleteById)
}

func (h *Handler) GetAll(c *fiber.Ctx) error {
	size := c.QueryInt("size", 20)
	page := c.QueryInt("page", 1)
	workspaceId := c.Params("workspaceId")
	projects, err := h.service.GetAll(size, (page-1)*size, workspaceId)
	if err != nil {
		return apperr.FiberError(c, err)
	}
	return appresponse.FiberResponse(c, fiber.StatusOK, "projects list", projects)
}

func (h *Handler) GetById(c *fiber.Ctx) error {
	id := c.Params("id")
	res, err := h.service.GetById(id)
	if err != nil {
		return apperr.FiberError(c, err)
	}
	return appresponse.FiberResponse(c, fiber.StatusOK, "project by id found", res)
}

func (h *Handler) Create(c *fiber.Ctx) error {
	workspaceId := c.Params("workspaceId")
	input := new(CreateInput)
	if err := c.BodyParser(input); err != nil {
		return apperr.FiberError(c, err)
	}
	project, err := h.service.Create(input, workspaceId)
	if err != nil {
		return apperr.FiberError(c, err)
	}
	return appresponse.FiberResponse(c, fiber.StatusOK, "New project", project)
}

func (h *Handler) DeleteById(c *fiber.Ctx) error {
	id := c.Params("id")
	err := h.service.DeleteById(id)
	if err != nil {
		return apperr.FiberError(c, err)
	}
	return appresponse.FiberResponse(c, fiber.StatusOK, "project by id deleted", "ok")
}

func (h *Handler) Update(c *fiber.Ctx) error {
	input := new(UpdateInput)
	if err := c.BodyParser(input); err != nil {
		return apperr.FiberError(c, err)
	}
	project, err := h.service.Update(input)
	if err != nil {
		return apperr.FiberError(c, err)
	}
	return appresponse.FiberResponse(c, fiber.StatusOK, "Update project", project)
}
