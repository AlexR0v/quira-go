package members

import (
	"github.com/rs/zerolog"

	"quira-api/internal/user"
	apperr "quira-api/pkg/app-err"
)

type Service struct {
	repo   *Repository
	logger *zerolog.Logger
}

func NewService(repo *Repository, logger *zerolog.Logger) *Service {
	return &Service{
		repo:   repo,
		logger: logger,
	}
}

func (s *Service) GetById(id string) (*ResponseMember, error) {
	member, err := s.repo.FindById(id)
	if err != nil {
		return nil, apperr.NewError(apperr.InternalServerError, err)
	}

	return mapMember(member), nil
}

func (s *Service) Create(user user.User) (*ResponseMember, error) {

	createdMember, err := s.repo.Create(user)
	if err != nil {
		return nil, apperr.NewError(apperr.BadRequest, err)
	}

	return mapMember(createdMember), nil
}
