package workspaces

import (
	"github.com/rs/zerolog"
	
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

func (s *Service) GetAll(limit, offset int, userId string) (*ResponseList, error) {
	workspaces, count, err := s.repo.FindAll(limit, offset, userId)
	if err != nil {
		return nil, apperr.NewError(apperr.InternalServerError, err)
	}
	var response []*WorkspaceResponse
	for _, workspace := range workspaces {
		response = append(response, MapWorkspace(workspace))
	}
	res := &ResponseList{
		Workspaces: response,
		TotalCount: count,
	}
	return res, nil
}

func (s *Service) GetById(id string) (*WorkspaceResponse, error) {
	wApp, err := s.repo.FindById(id)
	if err != nil {
		return nil, apperr.NewError(apperr.NotFound, err)
	}
	
	return MapWorkspace(wApp), nil
}

func (s *Service) Create(createInput *CreateInput, userId string) (*WorkspaceResponse, error) {
	
	newWorkspace := Workspace{
		Name:       createInput.Name,
		UserID:     userId,
		Image:      createInput.Image,
		InviteCode: createInput.InviteCode,
	}
	
	createdWorkspace, err := s.repo.Create(newWorkspace)
	if err != nil {
		return nil, apperr.NewError(apperr.BadRequest, err)
	}
	
	return MapWorkspace(createdWorkspace), nil
}

func (s *Service) DeleteById(id string) error {
	err := s.repo.DeleteById(id)
	if err != nil {
		return apperr.NewError(apperr.NotFound, err)
	}
	
	return nil
}

func (s *Service) Update(updateInput *UpdateInput) (*WorkspaceResponse, error) {
	
	updateWorkspace, err := s.repo.Update(updateInput)
	if err != nil {
		return nil, apperr.NewError(apperr.BadRequest, err)
	}
	
	return MapWorkspace(updateWorkspace), nil
}

func (s *Service) GetAnalytics(workspace, userId string) ResponseAnalytics {
	analytics := s.repo.GetAnalytics(workspace, userId)
	
	return analytics
}
