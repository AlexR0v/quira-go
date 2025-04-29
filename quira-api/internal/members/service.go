package members

import (
	"errors"
	"github.com/rs/zerolog"
	"quira-api/internal/user"
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
		return nil, app_err.NewError(app_err.UserExists, errors.New("пользователь уже состоит в данном проекте"))
	}
	return workspaces.MapWorkspace(workspaceW), nil
}

func (s *Service) DeleteMember(userId string, workspaceId string) error {
	err := s.repo.DeleteMember(userId, workspaceId)
	if err != nil {
		return app_err.NewError(app_err.NotFound, err)
	}

	return nil
}

func (s *Service) GetAllMembers(limit, offset int, workspaceId string) (*user.Response, error) {
	users, countUsers, err := s.repo.FindAll(limit, offset, workspaceId)
	if err != nil {
		return nil, app_err.NewError(app_err.InternalServerError, err)
	}
	var usersResponses []*user.ResponseUser
	for _, member := range users {
		usersResponses = append(usersResponses, user.MapUser(member))
	}
	res := &user.Response{
		Users:      usersResponses,
		TotalCount: countUsers,
	}
	return res, nil
}

func (s *Service) UpdateRole(input *InputUpdateRole) error {
	err := s.repo.UpdateRole(*input)
	if err != nil {
		return app_err.NewError(app_err.NotFound, err)
	}
	return nil
}
