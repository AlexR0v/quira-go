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
	var conditions []string
	var args []interface{}
	
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

func (r *Repository) CountThisMonth(projectId, userId string, incomplete string, overdue bool) int {
	var count int
	var err error
	if userId != "" {
		query := `SELECT count(id) FROM tasks
                 WHERE project_id = $1 AND assignee_id = $2
                   AND created_at >= date_trunc('month', current_date)
                   AND created_at < date_trunc('month', current_date) + interval '1 month'`
		err = r.db.QueryRow(context.Background(), query, projectId, userId).Scan(&count)
		if err != nil {
			r.logger.Error().Msg("Count error: " + err.Error())
			return 0
		}
		return count
	}
	if incomplete == "all" {
		query := `SELECT count(id) FROM tasks
                 WHERE project_id = $1
                   AND created_at >= date_trunc('month', current_date)
                   AND created_at < date_trunc('month', current_date) + interval '1 month'`
		err = r.db.QueryRow(context.Background(), query, projectId).Scan(&count)
		if err != nil {
			r.logger.Error().Msg("Count error: " + err.Error())
			return 0
		}
		return count
	}
	if incomplete == "exclude" {
		query := `SELECT count(id) FROM tasks
                 WHERE project_id = $1 AND status != 'DONE'
                   AND created_at >= date_trunc('month', current_date)
                   AND created_at < date_trunc('month', current_date) + interval '1 month'`
		err = r.db.QueryRow(context.Background(), query, projectId).Scan(&count)
		if err != nil {
			r.logger.Error().Msg("Count error: " + err.Error())
			return 0
		}
		return count
	}
	if incomplete == "include" {
		query := `SELECT count(id) FROM tasks
                 WHERE project_id = $1 AND status = 'DONE'
                   AND created_at >= date_trunc('month', current_date)
                   AND created_at < date_trunc('month', current_date) + interval '1 month'`
		err = r.db.QueryRow(context.Background(), query, projectId).Scan(&count)
		if err != nil {
			r.logger.Error().Msg("Count error: " + err.Error())
			return 0
		}
		return count
	}
	if incomplete == "select" {
		query := `SELECT count(id) FROM tasks
                 WHERE project_id = $1 AND status != 'DONE' AND due_date < current_date
                   AND created_at >= date_trunc('month', current_date)
                   AND created_at < date_trunc('month', current_date) + interval '1 month'`
		err = r.db.QueryRow(context.Background(), query, projectId).Scan(&count)
		if err != nil {
			r.logger.Error().Msg("Count error: " + err.Error())
			return 0
		}
		return count
	}
	return count
}

func (r *Repository) CountLastMonth(projectId, userId string, incomplete string, overdue bool) int {
	var count int
	var err error
	if userId != "" {
		query := `SELECT count(id) FROM tasks
                 WHERE project_id = $1 AND assignee_id = $2
                   AND created_at >= date_trunc('month', current_date) - interval '1 month'
                   AND created_at < date_trunc('month', current_date)`
		err = r.db.QueryRow(context.Background(), query, projectId, userId).Scan(&count)
		if err != nil {
			r.logger.Error().Msg("Count error: " + err.Error())
			return 0
		}
		return count
	}
	if incomplete == "all" {
		query := `SELECT count(id) FROM tasks
                 WHERE project_id = $1
                   AND created_at >= date_trunc('month', current_date) - interval '1 month'
                   AND created_at < date_trunc('month', current_date)`
		err = r.db.QueryRow(context.Background(), query, projectId).Scan(&count)
		if err != nil {
			r.logger.Error().Msg("Count error: " + err.Error())
			return 0
		}
		return count
	}
	if incomplete == "exclude" {
		query := `SELECT count(id) FROM tasks
                 WHERE project_id = $1 AND status = 'DONE'
                   AND created_at >= date_trunc('month', current_date) - interval '1 month'
                   AND created_at < date_trunc('month', current_date)`
		err = r.db.QueryRow(context.Background(), query, projectId).Scan(&count)
		if err != nil {
			r.logger.Error().Msg("Count error: " + err.Error())
			return 0
		}
		return count
	}
	if incomplete == "include" {
		query := `SELECT count(id) FROM tasks
                 WHERE project_id = $1 AND status != 'DONE'
                   AND created_at >= date_trunc('month', current_date) - interval '1 month'
                   AND created_at < date_trunc('month', current_date)`
		err = r.db.QueryRow(context.Background(), query, projectId).Scan(&count)
		if err != nil {
			r.logger.Error().Msg("Count error: " + err.Error())
			return 0
		}
		return count
	}
	if incomplete == "select" {
		query := `SELECT count(id) FROM tasks
                 WHERE project_id = $1 AND status != 'DONE' AND due_date < current_date
                   AND created_at >= date_trunc('month', current_date) - interval '1 month'
                   AND created_at < date_trunc('month', current_date)`
		err = r.db.QueryRow(context.Background(), query, projectId).Scan(&count)
		if err != nil {
			r.logger.Error().Msg("Count error: " + err.Error())
			return 0
		}
		return count
	}
	
	return count
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

func (r *Repository) FindAll(params TaskListParams) ResponseType {
	whereClause, args := buildFilters(params.userId, params.projectId, params.status, params.name, params.dueDate)
	argCount := len(args) + 1
	
	query := "SELECT tasks.*, u.first_name AS assignee_first_name, u.last_name AS assignee_last_name FROM tasks JOIN public.users u on u.id = tasks.assignee_id" + whereClause
	
	if params.sortField != "" {
		query += fmt.Sprintf(" ORDER BY %s", params.sortField)
		if params.sortOrder == "desc" {
			query += " DESC"
		} else {
			query += " ASC"
		}
	} else {
		query += " ORDER BY created_at DESC"
	}
	
	query += fmt.Sprintf(" LIMIT $%d OFFSET $%d", argCount, argCount+1)
	args = append(args, params.limit, params.offset)
	
	rows, err := r.db.Query(context.Background(), query, args...)
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return ResponseType{
			Err: err,
		}
	}
	defer rows.Close()
	
	tasksRow, err := pgx.CollectRows(rows, pgx.RowToStructByName[Task])
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return ResponseType{
			Err: err,
		}
	}
	
	count := r.Count(params.userId, params.projectId, params.status, params.name, params.dueDate)
	countThisMonthRow := r.CountThisMonth(params.projectId, "", "all", false)
	countLastMonthRow := r.CountLastMonth(params.projectId, "", "all", false)
	countThisMonthByUserRow := r.CountThisMonth(params.projectId, params.currentUserId, "all", false)
	countLastMonthByUserRow := r.CountLastMonth(params.projectId, params.currentUserId, "all", false)
	countThisMonthIncompleteRow := r.CountThisMonth(params.projectId, "", "include", false)
	countLastMonthIncompleteRow := r.CountLastMonth(params.projectId, "", "include", false)
	countThisMonthCompleteRow := r.CountThisMonth(params.projectId, "", "exclude", false)
	countLastMonthCompleteRow := r.CountLastMonth(params.projectId, "", "exclude", false)
	countOverdueThisMonthRow := r.CountThisMonth(params.projectId, "", "select", true)
	counOverduetLastMonthRow := r.CountLastMonth(params.projectId, "", "select", true)
	
	return ResponseType{
		Tasks:               tasksRow,
		Total:               count,
		CountDiff:           countThisMonthRow - countLastMonthRow,
		CountAssigned:       countThisMonthByUserRow,
		CountAssignedDiff:   countThisMonthByUserRow - countLastMonthByUserRow,
		CountIncompleteDiff: countThisMonthIncompleteRow - countLastMonthIncompleteRow,
		CountIncomplete:     countThisMonthIncompleteRow,
		CountCompleteDiff:   countThisMonthCompleteRow - countLastMonthCompleteRow,
		CountComplete:       countThisMonthCompleteRow,
		CountOverdue:        countOverdueThisMonthRow,
		CountOverdueDiff:    countOverdueThisMonthRow - counOverduetLastMonthRow,
		Err:                 nil,
	}
}

func (r *Repository) FindById(id string) (*TaskSingle, error) {
	query := `SELECT
    	t.*,
    	u.first_name AS assignee_first_name,
    	u.last_name AS assignee_last_name,
    	p.name as project_name,
    	w.name as workspace_name
	FROM tasks t
    JOIN public.users u on u.id = t.assignee_id
	JOIN public.projects p on p.id = t.project_id
	JOIN public.workspaces w on w.id = t.workspace_id
	WHERE t.id = $1`
	rows, err := r.db.Query(context.Background(), query, id)
	defer rows.Close()
	task, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[TaskSingle])
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return nil, err
	}
	return &task, nil
}

func (r *Repository) Create(newTask *CreateInput) (*TaskSingle, error) {
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
		return nil, errPosition
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
		return nil, err
	}
	
	task, err := r.FindById(strconv.FormatInt(taskId, 10))
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return nil, err
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

func (r *Repository) Update(taskUpdate *UpdateInput) (*TaskSingle, error) {
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
		return nil, err
	}
	
	task, err := r.FindById(strconv.FormatInt(taskId, 10))
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return nil, err
	}
	
	return task, nil
}
