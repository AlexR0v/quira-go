package user

import (
	"github.com/rs/zerolog"
	"net/mail"
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

func (s *Service) GetAllUsers() ([]User, error) {
	users, err := s.userRepo.FindAllUsers()
	if err != nil {
		return nil, err
	}
	for _, user := range users {
		user.Password = "******"
	}
	return users, nil
}
