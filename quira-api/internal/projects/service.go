package projects

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

func (s *Service) GetAll(limit, offset int, workspaceId string) (*ResponseList, error) {
	workspaces, count, err := s.repo.FindAll(limit, offset, workspaceId)
	if err != nil {
		return nil, apperr.NewError(apperr.InternalServerError, err)
	}
	var response []*ProjectResponse
	for _, workspace := range workspaces {
		response = append(response, MapProject(workspace))
	}
	res := &ResponseList{
		Projects:   response,
		TotalCount: count,
	}
	return res, nil
}

func (s *Service) GetById(id string) (*ProjectResponse, error) {
	wApp, err := s.repo.FindById(id)
	if err != nil {
		return nil, apperr.NewError(apperr.NotFound, err)
	}

	return MapProject(wApp), nil
}

func (s *Service) Create(createInput *CreateInput, workspaceId string) (*ProjectResponse, error) {

	newProject := Project{
		Name:        createInput.Name,
		WorkspaceID: workspaceId,
		Image:       createInput.Image,
	}

	createdProject, err := s.repo.Create(newProject)
	if err != nil {
		return nil, apperr.NewError(apperr.BadRequest, err)
	}

	return MapProject(createdProject), nil
}

func (s *Service) DeleteById(id string) error {
	err := s.repo.DeleteById(id)
	if err != nil {
		return apperr.NewError(apperr.NotFound, err)
	}

	return nil
}

func (s *Service) Update(updateInput *UpdateInput) (*ProjectResponse, error) {

	updateProject, err := s.repo.Update(updateInput)
	if err != nil {
		return nil, apperr.NewError(apperr.BadRequest, err)
	}

	return MapProject(updateProject), nil
}
