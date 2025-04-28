package user

import (
	"github.com/rs/zerolog"
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

func (s *Service) GetAllUsers(limit, offset int) (*Response, error) {
	users, countUsers, err := s.userRepo.FindAllUsers(limit, offset)
	if err != nil {
		return nil, apperr.NewError(apperr.InternalServerError, err)
	}
	var usersResponses []*ResponseUser
	for _, user := range users {
		usersResponses = append(usersResponses, MapUser(user))
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
	usersResponses := MapUser(userApp)

	return usersResponses, nil
}

func (s *Service) GetUserByEmail(email string) (*ResponseUser, error) {
	userApp, err := s.userRepo.FindUserByEmail(email)
	if err != nil {
		return nil, apperr.NewError(apperr.NotFound, err)
	}
	usersResponses := MapUser(userApp)

	return usersResponses, nil
}
