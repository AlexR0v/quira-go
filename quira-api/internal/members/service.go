package members

import (
	"errors"
	"github.com/rs/zerolog"
	"quira-api/internal/workspaces"
	app_err "quira-api/pkg/app-err"
)

type Service struct {
	repo           *Repository
	repoWorkspaces *workspaces.Repository
	logger         *zerolog.Logger
}

func NewService(repo *Repository, logger *zerolog.Logger, repoWorkspaces *workspaces.Repository) *Service {
	return &Service{
		repo:           repo,
		logger:         logger,
		repoWorkspaces: repoWorkspaces,
	}
}

func (s *Service) Join(input *InputJoin, userId string) (*workspaces.WorkspaceResponse, error) {

	workspace, err := s.repoWorkspaces.FindByMemberId(input.WorkspaceID.(string), userId)
	if err != nil {
		return nil, err
	}

	workspaceW, err := s.repoWorkspaces.FindById(input.WorkspaceID.(string))
	if err != nil {
		return nil, err
	}

	if workspace.ID == nil {
		errJoin := s.repo.JoinMember(workspaceW, userId)
		if errJoin != nil {
			return nil, errJoin
		}
	} else {
		return nil, app_err.NewError(app_err.BadRequest, errors.New("пользователь уже состоит в данном рабочем пространстве"))
	}
	return workspaces.MapWorkspace(workspaceW), nil
}
