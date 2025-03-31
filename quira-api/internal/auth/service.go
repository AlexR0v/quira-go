package auth

import (
	"github.com/rs/zerolog"
	"golang.org/x/crypto/bcrypt"
	"net/mail"
	"quira-api/internal/user"
	"quira-api/pkg/app-err"
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
		return "", app_err.NewError(app_err.InvalidEmail, app_err.InvalidEmail)
	}

	existedUser, err := s.userRepo.FindUserByEmail(loginInput.Email)
	if err != nil {
		return "", app_err.NewError(app_err.LoginOrPasswordIncorrect, err)
	}

	password := []byte(loginInput.Password)
	err = bcrypt.CompareHashAndPassword([]byte(existedUser.Password), password)
	if err != nil {
		return "", app_err.NewError(app_err.LoginOrPasswordIncorrect, err)
	}

	return "test", nil
}

func (s *Service) Register(registerInput *RegisterInput) (string, error) {
	if !validEmail(registerInput.Email) {
		return "", app_err.NewError(app_err.InvalidEmail, app_err.InvalidEmail)
	}

	userExist, err := s.userRepo.FindUserByEmail(registerInput.Email)

	if userExist.Email != "" {
		return "", app_err.NewError(app_err.UserExists, err)
	}

	password, bcryptErr := bcrypt.GenerateFromPassword([]byte(registerInput.Password), bcrypt.DefaultCost)
	if bcryptErr != nil {
		return "", bcryptErr
	}

	newUser := user.User{
		Email:     registerInput.Email,
		Password:  string(password),
		Role:      "USER",
		FirstName: registerInput.FirstName,
		LastName:  registerInput.LastName,
	}

	_, err = s.userRepo.CreateUser(newUser)
	if err != nil {
		return "", app_err.NewError(app_err.BadRequest, err)
	}

	return "test", nil
}
