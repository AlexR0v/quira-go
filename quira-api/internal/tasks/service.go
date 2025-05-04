package tasks

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

func (s *Service) GetAll(params TaskListParams) (*ResponseList, error) {
	repoRes := s.repo.FindAll(params)
	if repoRes.Err != nil {
		return nil, apperr.NewError(apperr.InternalServerError, repoRes.Err)
	}
	var response []*TaskResponse
	for _, task := range repoRes.Tasks {
		response = append(response, MapTask(task))
	}
	res := &ResponseList{
		Tasks:               response,
		TotalCount:          repoRes.Total,
		CountDiff:           repoRes.CountDiff,
		CountAssigned:       repoRes.CountAssigned,
		CountAssignedDiff:   repoRes.CountAssignedDiff,
		CountIncomplete:     repoRes.CountIncomplete,
		CountIncompleteDiff: repoRes.CountIncompleteDiff,
		CountComplete:       repoRes.CountComplete,
		CountCompleteDiff:   repoRes.CountCompleteDiff,
	}
	return res, nil
}

func (s *Service) GetById(id string) (*TaskSingle, error) {
	wApp, err := s.repo.FindById(id)
	if err != nil {
		return nil, apperr.NewError(apperr.NotFound, err)
	}
	
	return wApp, nil
}

func (s *Service) Create(createInput *CreateInput) (*TaskSingle, error) {
	createdTask, err := s.repo.Create(createInput)
	if err != nil {
		return nil, apperr.NewError(apperr.BadRequest, err)
	}
	
	return createdTask, nil
}

func (s *Service) DeleteById(id string) error {
	err := s.repo.DeleteById(id)
	if err != nil {
		return apperr.NewError(apperr.NotFound, err)
	}
	
	return nil
}

func (s *Service) Update(updateInput *UpdateInput) (*TaskSingle, error) {
	
	updateTask, err := s.repo.Update(updateInput)
	if err != nil {
		return nil, apperr.NewError(apperr.BadRequest, err)
	}
	
	return updateTask, nil
}
