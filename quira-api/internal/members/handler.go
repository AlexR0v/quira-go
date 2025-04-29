package members

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
	api := h.router.Group("/members")
	api.Get("/:workspaceId", h.GetAllMembers)
	api.Post("/join", h.Join)
	api.Post("/update-role", h.UpdateRole)
	api.Delete("/:workspaceId/:userId", h.DeleteMember)
}

func (h *Handler) Join(c *fiber.Ctx) error {
	input := new(InputJoin)
	if err := c.BodyParser(input); err != nil {
		return apperr.FiberError(c, err)
	}
	userId, ok := c.Locals("userId").(string)
	if !ok {
		return apperr.FiberError(c, apperr.NewError(apperr.UserExists, errors.New("userId not found in context")))
	}
	workspace, err := h.service.Join(input, userId)
	if err != nil {
		return apperr.FiberError(c, err)
	}
	return appresponse.FiberResponse(c, fiber.StatusOK, "workspace", workspace)
}

func (h *Handler) DeleteMember(c *fiber.Ctx) error {
	workspaceId := c.Params("workspaceId")
	userId := c.Params("userId")
	err := h.service.DeleteMember(userId, workspaceId)
	if err != nil {
		return apperr.FiberError(c, err)
	}
	return appresponse.FiberResponse(c, fiber.StatusOK, "MemberDelete", "deleted")
}

func (h *Handler) GetAllMembers(c *fiber.Ctx) error {
	workspaceId := c.Params("workspaceId")
	size := c.QueryInt("size", 20)
	page := c.QueryInt("page", 1)
	users, err := h.service.GetAllMembers(size, (page-1)*size, workspaceId)
	if err != nil {
		return apperr.FiberError(c, err)
	}
	return appresponse.FiberResponse(c, fiber.StatusOK, "Members list", users)
}

func (h *Handler) UpdateRole(c *fiber.Ctx) error {
	input := new(InputUpdateRole)
	if err := c.BodyParser(input); err != nil {
		return apperr.FiberError(c, err)
	}
	err := h.service.UpdateRole(input)
	if err != nil {
		return apperr.FiberError(c, err)
	}
	return appresponse.FiberResponse(c, fiber.StatusOK, "Role updated", "ok")
}
