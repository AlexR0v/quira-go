package tasks

import (
	"time"
	
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

func (s *Service) GetAll(
	limit, offset int,
	projectId, userId, status, name, sortField, sortOrder string,
	dueDate *time.Time,
) (*ResponseList, error) {
	tasks, count, err := s.repo.FindAll(
		limit, offset, projectId, userId,
		status, name, sortField, sortOrder,
		dueDate,
	)
	if err != nil {
		return nil, apperr.NewError(apperr.InternalServerError, err)
	}
	var response []*TaskResponse
	for _, task := range tasks {
		response = append(response, MapTask(task))
	}
	res := &ResponseList{
		Tasks:      response,
		TotalCount: count,
	}
	return res, nil
}

func (s *Service) GetById(id string) (*TaskResponse, error) {
	wApp, err := s.repo.FindById(id)
	if err != nil {
		return nil, apperr.NewError(apperr.NotFound, err)
	}
	
	return MapTask(wApp), nil
}

func (s *Service) Create(createInput *CreateInput) (*TaskResponse, error) {
	createdTask, err := s.repo.Create(createInput)
	if err != nil {
		return nil, apperr.NewError(apperr.BadRequest, err)
	}
	
	return MapTask(createdTask), nil
}

func (s *Service) DeleteById(id string) error {
	err := s.repo.DeleteById(id)
	if err != nil {
		return apperr.NewError(apperr.NotFound, err)
	}
	
	return nil
}

func (s *Service) Update(updateInput *UpdateInput) (*TaskResponse, error) {
	
	updateTask, err := s.repo.Update(updateInput)
	if err != nil {
		return nil, apperr.NewError(apperr.BadRequest, err)
	}
	
	return MapTask(updateTask), nil
}
