package app_err

import (
	"errors"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

type HttpError struct {
	Status  int
	Message string
}

func FromError(err error) HttpError {
	var apiErr HttpError
	var serviceError Error
	if errors.As(err, &serviceError) {
		apiErr.Message = serviceError.GetAppError().Error()
		srvErr := serviceError.GetServiceError()
		switch {
		case errors.Is(srvErr, InvalidEmail):
			apiErr.Status = http.StatusBadRequest
		case errors.Is(srvErr, InvalidPassword):
			apiErr.Status = http.StatusBadRequest
		case errors.Is(srvErr, LoginOrPasswordIncorrect):
			apiErr.Status = http.StatusBadRequest
		case errors.Is(srvErr, UnprocessableEntity):
			apiErr.Status = http.StatusBadRequest
		case errors.Is(srvErr, BadRequest):
			apiErr.Status = http.StatusBadRequest
		case errors.Is(srvErr, UserNotFound):
			apiErr.Status = http.StatusNotFound
		case errors.Is(srvErr, NotFound):
			apiErr.Status = http.StatusNotFound
		case errors.Is(srvErr, UserExists):
			apiErr.Status = http.StatusConflict
		case errors.Is(srvErr, InternalServerError):
			apiErr.Status = http.StatusInternalServerError
		default:
			apiErr.Status = http.StatusInternalServerError
		}
	} else {
		apiErr.Message = err.Error()
		apiErr.Status = http.StatusInternalServerError
	}
	return apiErr
}

func FiberError(c *fiber.Ctx, err error) error {
	httpError := FromError(err)
	return c.Status(httpError.Status).JSON(
		fiber.Map{
			"status":  "error",
			"message": httpError.Message,
			"errors":  err.Error(),
		},
	)
}
