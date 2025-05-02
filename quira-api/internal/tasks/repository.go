package tasks

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strconv"
	"strings"
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

func buildFilters(
	userId, projectId, status, name string,
	dueDate *time.Time,
) (string, []interface{}) {
	conditions := []string{}
	args := []interface{}{}
	
	if userId != "" {
		conditions = append(conditions, fmt.Sprintf("assignee_id = $%d", len(args)+1))
		args = append(args, userId)
	}
	if projectId != "" {
		conditions = append(conditions, fmt.Sprintf("project_id = $%d", len(args)+1))
		args = append(args, projectId)
	}
	if status != "" {
		conditions = append(conditions, fmt.Sprintf("status = $%d", len(args)+1))
		args = append(args, status)
	}
	if name != "" {
		conditions = append(conditions, fmt.Sprintf("name ILIKE $%d", len(args)+1))
		args = append(args, "%"+name+"%")
	}
	if dueDate != nil {
		conditions = append(conditions, fmt.Sprintf("due_date = $%d", len(args)+1))
		args = append(args, *dueDate)
	}
	
	if len(conditions) == 0 {
		return "", args
	}
	
	return " WHERE " + strings.Join(conditions, " AND "), args
}

func (r *Repository) Count(
	userId, projectId, status, name string,
	dueDate *time.Time,
) int {
	whereClause, args := buildFilters(userId, projectId, status, name, dueDate)
	query := "SELECT count(id) FROM tasks" + whereClause
	
	var count int
	err := r.db.QueryRow(context.Background(), query, args...).Scan(&count)
	if err != nil {
		r.logger.Error().Msg("Count error: " + err.Error())
		return 0
	}
	return count
}

func (r *Repository) FindAll(
	limit, offset int,
	projectId, userId, status, name, sortField, sortOrder string,
	dueDate *time.Time,
) ([]Task, int, error) {
	whereClause, args := buildFilters(userId, projectId, status, name, dueDate)
	argCount := len(args) + 1
	
	query := "SELECT tasks.*, u.first_name AS assignee_first_name, u.last_name AS assignee_last_name FROM tasks JOIN public.users u on u.id = tasks.assignee_id" + whereClause
	
	if sortField != "" {
		query += fmt.Sprintf(" ORDER BY %s", sortField)
		if sortOrder == "desc" {
			query += " DESC"
		} else {
			query += " ASC"
		}
	} else {
		query += " ORDER BY created_at DESC"
	}
	
	query += fmt.Sprintf(" LIMIT $%d OFFSET $%d", argCount, argCount+1)
	args = append(args, limit, offset)
	
	rows, err := r.db.Query(context.Background(), query, args...)
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return nil, 0, err
	}
	defer rows.Close()
	
	tasks, err := pgx.CollectRows(rows, pgx.RowToStructByName[Task])
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return nil, 0, err
	}
	
	count := r.Count(userId, projectId, status, name, dueDate)
	return tasks, count, nil
}

func (r *Repository) FindById(id string) (Task, error) {
	query := "SELECT t.name, t.workspace_id, t.project_id, t.assignee_id, t.description, t.due_date, t.position, t.status, t.created_at, t.id  FROM tasks t WHERE id = $1"
	var task Task
	err := r.db.QueryRow(context.Background(), query, id).Scan(
		&task.Name,
		&task.WorkspaceID,
		&task.ProjectID,
		&task.AssigneeID,
		&task.Description,
		&task.DueDate,
		&task.Position,
		&task.Status,
		&task.CreatedAt,
		&task.ID,
	)
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return Task{}, err
	}
	return task, nil
}

func (r *Repository) Create(newTask *CreateInput) (Task, error) {
	var highestPosition sql.NullInt64
	queryHighestPosition := "SELECT max(position) FROM tasks WHERE project_id = $1 AND status = $2"
	errPosition := r.db.QueryRow(
		context.Background(),
		queryHighestPosition,
		newTask.ProjectID,
		newTask.Status,
	).Scan(&highestPosition)
	if errPosition != nil {
		if errors.Is(errPosition, sql.ErrNoRows) {
			highestPosition = sql.NullInt64{Int64: 0, Valid: false}
		}
		r.logger.Error().Msg(errPosition.Error())
		return Task{}, errPosition
	}
	
	query := `INSERT INTO tasks
    (name, workspace_id, project_id, assignee_id, description, due_date, status, position, created_at)
	VALUES (@name, @workspace_id, @project_id, @assignee_id, @description, @due_date, @status, @position, @created_at) returning id`
	
	var position int64
	if !highestPosition.Valid {
		position = 1000
	} else {
		position = highestPosition.Int64 + 1000
	}
	
	args := pgx.NamedArgs{
		"name":         newTask.Name,
		"workspace_id": newTask.WorkspaceID,
		"project_id":   newTask.ProjectID,
		"assignee_id":  newTask.AssigneeID,
		"description":  newTask.Description,
		"due_date":     newTask.DueDate,
		"status":       newTask.Status,
		"position":     position,
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
