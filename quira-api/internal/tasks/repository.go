package tasks

import (
	"context"
	"strconv"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/zerolog"
)

type Repository struct {
	db     *pgxpool.Pool
	logger *zerolog.Logger
}

func NewRepository(db *pgxpool.Pool, logger *zerolog.Logger) *Repository {
	return &Repository{
		db:     db,
		logger: logger,
	}
}

func (r *Repository) Count(projectId string) int {
	query := "SELECT count(id) from tasks where project_id = $1"
	var count int
	err := r.db.QueryRow(context.Background(), query, projectId).Scan(&count)
	if err != nil {
		return 0
	}
	return count
}

func (r *Repository) FindAll(limit, offset int, projectId, userId string) ([]Task, int, error) {
	var query string
	var err error
	var rows pgx.Rows
	if userId != "" {
		query = "SELECT t.* FROM tasks t where t.assignee_id = $3 order by t.created_at desc limit $1 offset $2"
		rows, err = r.db.Query(context.Background(), query, limit, offset, userId)
	} else {
		query = "SELECT t.* FROM tasks t where t.project_id = $3 order by t.created_at desc limit $1 offset $2"
		rows, err = r.db.Query(context.Background(), query, limit, offset, projectId)
	}
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return nil, 0, err
	}
	defer rows.Close()
	tasks, err := pgx.CollectRows(rows, pgx.RowToStructByName[Task])
	count := r.Count(projectId)

	if err != nil {
		r.logger.Error().Msg(err.Error())
		return nil, 0, err
	}

	return tasks, count, nil
}

func (r *Repository) FindById(id string) (Task, error) {
	query := "SELECT t.* FROM tasks t WHERE id = $1"
	row, err := r.db.Query(context.Background(), query, id)
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return Task{}, err
	}
	task, err := pgx.RowToStructByName[Task](row)
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return Task{}, err
	}
	return task, nil
}

func (r *Repository) Create(newTask *CreateInput) (Task, error) {
	query := `INSERT INTO tasks
    (name, workspace_id, project_id, assignee_id, description, due_date, status, position, created_at)
	VALUES (@name, @workspace_id, @project_id, @assignee_id, @description, @due_date, @status, @position, @created_at) returning id`
	args := pgx.NamedArgs{
		"name":         newTask.Name,
		"workspace_id": newTask.WorkspaceID,
		"project_id":   newTask.ProjectID,
		"assignee_id":  newTask.AssigneeID,
		"description":  newTask.Description,
		"due_date":     newTask.DueDate,
		"status":       newTask.Status,
		"position":     newTask.Position,
		"created_at":   time.Now(),
	}
	row := r.db.QueryRow(context.Background(), query, args)
	var taskId int64
	err := row.Scan(&taskId)
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return Task{}, err
	}

	task, err := r.FindById(strconv.FormatInt(taskId, 10))
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return Task{}, err
	}
	return task, nil
}

func (r *Repository) DeleteById(id string) error {
	query := "DELETE FROM tasks WHERE id = $1"
	_, err := r.db.Exec(context.Background(), query, id)
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return err
	}
	return nil
}

func (r *Repository) Update(taskUpdate *UpdateInput) (Task, error) {
	query := `UPDATE tasks SET
                 name = @name,
                 workspace_id = @workspace_id,
                 project_id = @project_id,
                 assignee_id = @assignee_id,
                 description = @description,
                 due_date = @due_date,
                 status = @status,
                 position = @position
             WHERE id = @id RETURNING id`
	args := pgx.NamedArgs{
		"name":         taskUpdate.Name,
		"workspace_id": taskUpdate.WorkspaceID,
		"project_id":   taskUpdate.ProjectID,
		"assignee_id":  taskUpdate.AssigneeID,
		"description":  taskUpdate.Description,
		"due_date":     taskUpdate.DueDate,
		"status":       taskUpdate.Status,
		"position":     taskUpdate.Position,
		"id":           taskUpdate.ID,
	}
	row := r.db.QueryRow(context.Background(), query, args)
	var taskId int64
	err := row.Scan(&taskId)
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return Task{}, err
	}

	task, err := r.FindById(strconv.FormatInt(taskId, 10))
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return Task{}, err
	}

	return task, nil
}
