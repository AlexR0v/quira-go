package tasks

import (
	"errors"
	"time"
	
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
	api := h.router.Group("/tasks")
	api.Get("/", h.GetAll)
	api.Post("/", h.Create)
	api.Patch("/", h.Update)
	api.Get("/:id", h.GetById)
	api.Delete("/:id", h.DeleteById)
}

func (h *Handler) GetAll(c *fiber.Ctx) error {
	size := c.QueryInt("size", 20)
	page := c.QueryInt("page", 1)
	projectId := c.Query("projectId", "")
	userId := c.Query("userId", "")
	status := c.Query("status", "")
	name := c.Query("name", "")
	sortField := c.Query("sortField", "")
	sortOrder := c.Query("sortOrder", "")
	dueDateStr := c.Query("dueDate", "")
	var dueDate *time.Time
	var err error
	if dueDateStr != "" {
		parsedDate, err := time.Parse("2006-01-02 15:04:05", dueDateStr)
		if err != nil {
			return apperr.FiberError(c, err)
		}
		dueDate = &parsedDate
	}
	
	currentUserId, ok := c.Locals("userId").(string)
	if !ok {
		return apperr.FiberError(
			c,
			apperr.NewError(apperr.BadRequest, errors.New("current userId not found in context")),
		)
	}
	
	tasks, err := h.service.GetAll(
		TaskListParams{
			limit:         size,
			offset:        (page - 1) * size,
			projectId:     projectId,
			userId:        userId,
			status:        status,
			name:          name,
			sortField:     sortField,
			sortOrder:     sortOrder,
			dueDate:       dueDate,
			currentUserId: currentUserId,
		},
	)
	
	if err != nil {
		return apperr.FiberError(c, err)
	}
	return appresponse.FiberResponse(c, fiber.StatusOK, "tasks list", tasks)
}

func (h *Handler) GetById(c *fiber.Ctx) error {
	id := c.Params("id")
	res, err := h.service.GetById(id)
	if err != nil {
		return apperr.FiberError(c, err)
	}
	return appresponse.FiberResponse(c, fiber.StatusOK, "task by id found", res)
}

func (h *Handler) Create(c *fiber.Ctx) error {
	input := new(CreateInput)
	if err := c.BodyParser(input); err != nil {
		return apperr.FiberError(c, err)
	}
	task, err := h.service.Create(input)
	if err != nil {
		return apperr.FiberError(c, err)
	}
	return appresponse.FiberResponse(c, fiber.StatusOK, "New task", task)
}

func (h *Handler) DeleteById(c *fiber.Ctx) error {
	id := c.Params("id")
	err := h.service.DeleteById(id)
	if err != nil {
		return apperr.FiberError(c, err)
	}
	return appresponse.FiberResponse(c, fiber.StatusOK, "task by id deleted", "ok")
}

func (h *Handler) Update(c *fiber.Ctx) error {
	input := new(UpdateInput)
	if err := c.BodyParser(input); err != nil {
		return apperr.FiberError(c, err)
	}
	task, err := h.service.Update(input)
	if err != nil {
		return apperr.FiberError(c, err)
	}
	return appresponse.FiberResponse(c, fiber.StatusOK, "Update task", task)
}
