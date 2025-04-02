package user

import (
	"github.com/rs/zerolog"
	"net/mail"
	apperr "quira-api/pkg/app-err"
)

type Service struct {
	userRepo *Repository
	logger   *zerolog.Logger
}

func NewService(userRepo *Repository, logger *zerolog.Logger) *Service {
	return &Service{
		userRepo: userRepo,
		logger:   logger,
	}
}

func validEmail(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil
}

func (s *Service) GetAllUsers(limit, offset int) (*Response, error) {
	users, countUsers, err := s.userRepo.FindAllUsers(limit, offset)
	if err != nil {
		return nil, apperr.NewError(apperr.InternalServerError, err)
	}
	var usersResponses []*ResponseUser
	for _, user := range users {
		usersResponses = append(usersResponses, mapUser(user))
	}
	res := &Response{
		Users:      usersResponses,
		TotalCount: countUsers,
	}
	return res, nil
}

func (s *Service) GetUserById(id string) (*ResponseUser, error) {
	userApp, err := s.userRepo.FindUserById(id)
	if err != nil {
		return nil, apperr.NewError(apperr.NotFound, err)
	}
	usersResponses := mapUser(userApp)

	return usersResponses, nil
}
