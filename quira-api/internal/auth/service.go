package auth

import (
	"errors"
	"github.com/rs/zerolog"
	"net/mail"
	"quira-api/internal/user"
)

type Service struct {
	userRepo *user.Repository
	logger   *zerolog.Logger
}

func NewService(userRepo *user.Repository, logger *zerolog.Logger) *Service {
	return &Service{
		userRepo: userRepo,
		logger:   logger,
	}
}

func validEmail(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil
}

func (s *Service) Login(loginInput *LoginInput) (string, error) {
	if !validEmail(loginInput.Email) {
		return "", errors.New("invalid email")
	}

	_, err := s.userRepo.FindUserByEmail(loginInput.Email)
	if err != nil {
		return "", err
	}

	return "test", nil
}
