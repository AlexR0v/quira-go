package tasks

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
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

func (r *Repository) Count(taskIDs []string) int {
	query := "SELECT count(id) from tasks where id = ANY ($1)"
	var count int
	err := r.db.QueryRow(context.Background(), query, taskIDs).Scan(&count)
	if err != nil {
		return 0
	}
	return count
}

func (r *Repository) FindAll(
	limit, offset int,
	projectId, userId, status, name, sortField, sortOrder string,
	startDate, endDate *time.Time,
) ([]Task, int, error) {
	var query string
	var err error
	var args []interface{}
	argCount := 1
	
	query = "SELECT * FROM tasks WHERE 1=1"
	
	if userId != "" {
		query += fmt.Sprintf(" AND assignee_id = $%d", argCount)
		args = append(args, userId)
		argCount++
	}
	
	if projectId != "" {
		query += fmt.Sprintf(" AND project_id = $%d", argCount)
		args = append(args, projectId)
		argCount++
	}
	
	if status != "" {
		query += fmt.Sprintf(" AND status = $%d", argCount)
		args = append(args, status)
		argCount++
	}
	
	if name != "" {
		query += fmt.Sprintf(" AND name ILIKE $%d", argCount)
		args = append(args, "%"+name+"%")
		argCount++
	}
	if startDate != nil {
		query += fmt.Sprintf(" AND due_date >= $%d", argCount)
		args = append(args, *startDate)
		argCount++
	}
	
	if endDate != nil {
		query += fmt.Sprintf(" AND due_date <= $%d", argCount)
		args = append(args, *endDate)
		argCount++
	}
	
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
	
	var taskIDs []string
	for _, task := range tasks {
		taskIDs = append(taskIDs, strconv.Itoa(int(task.ID)))
	}
	
	var count int
	if len(taskIDs) == 0 {
		count = 0
	} else {
		count = r.Count(taskIDs)
	}
	
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return nil, 0, err
	}
	
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
