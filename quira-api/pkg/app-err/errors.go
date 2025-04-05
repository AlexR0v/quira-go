package app_err

import "errors"

var (
	InvalidEmail             = errors.New("invalid email")
	InvalidPassword          = errors.New("invalid password")
	UserNotFound             = errors.New("user not found")
	UserExists               = errors.New("user already exists")
	LoginOrPasswordIncorrect = errors.New("login or password incorrect")
	BadRequest               = errors.New("bad request")
	NotFound                 = errors.New("not found")
	InternalServerError      = errors.New("internal server error")
	UnprocessableEntity      = errors.New("unprocessable Entity")
	Unauthorized             = errors.New("unauthorized error")
)

type Error struct {
	appErr       error
	serviceError error
}

func NewError(serviceError error, appError error) Error {
	return Error{
		appErr:       appError,
		serviceError: serviceError,
	}
}

func (e Error) Error() string {
	return errors.Join(e.appErr, e.serviceError).Error()
}

func (e Error) GetAppError() error {
	return e.appErr
}

func (e Error) GetServiceError() error {
	return e.serviceError
}
