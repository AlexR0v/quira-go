package tasks

import (
	"github.com/jackc/pgx/v5/pgtype"
)

type Status string

const (
	BACKLOG     Status = "BACKLOG"
	TODO        Status = "TODO"
	IN_PROGRESS Status = "IN_PROGRESS"
	IN_REVIEW   Status = "IN_REVIEW"
	DONE        Status = "DONE"
)

type Task struct {
	Name              string           `json:"name"`
	WorkspaceID       string           `json:"workspace_id"`
	ProjectID         string           `json:"project_id"`
	AssigneeID        string           `json:"assignee_id"`
	AssigneeFirstName string           `json:"assignee_first_name"`
	AssigneeLastName  string           `json:"assignee_last_name"`
	Description       string           `json:"description"`
	DueDate           pgtype.Timestamp `json:"due_date"`
	Position          int              `json:"position"`
	Status            Status           `json:"status"`
	CreatedAt         pgtype.Timestamp `json:"created_at"`
	ID                int64            `json:"id"`
}

type TaskResponse struct {
	Name              string           `json:"name"`
	WorkspaceID       string           `json:"workspace_id"`
	ProjectID         string           `json:"project_id"`
	AssigneeID        string           `json:"assignee_id"`
	AssigneeFirstName string           `json:"assignee_first_name"`
	AssigneeLastName  string           `json:"assignee_last_name"`
	Description       string           `json:"description"`
	DueDate           pgtype.Timestamp `json:"due_date"`
	Position          int              `json:"position"`
	Status            Status           `json:"status"`
	CreatedAt         pgtype.Timestamp `json:"created_at"`
	ID                any              `json:"id"`
}

type ResponseList struct {
	TotalCount int             `json:"total_count"`
	Tasks      []*TaskResponse `json:"tasks"`
}

type CreateInput struct {
	Name        string           `json:"name"`
	WorkspaceID string           `json:"workspace_id"`
	ProjectID   string           `json:"project_id"`
	AssigneeID  string           `json:"assignee_id"`
	Description string           `json:"description"`
	DueDate     pgtype.Timestamp `json:"due_date"`
	Status      Status           `json:"status"`
}

type UpdateInput struct {
	ID          any              `json:"id"`
	Name        string           `json:"name"`
	WorkspaceID string           `json:"workspace_id"`
	ProjectID   string           `json:"project_id"`
	AssigneeID  string           `json:"assignee_id"`
	Description string           `json:"description"`
	DueDate     pgtype.Timestamp `json:"due_date"`
	Position    int              `json:"position"`
	Status      Status           `json:"status"`
}

func MapTask(task Task) *TaskResponse {
	return &TaskResponse{
		ID:                task.ID,
		Name:              task.Name,
		WorkspaceID:       task.WorkspaceID,
		ProjectID:         task.ProjectID,
		AssigneeID:        task.AssigneeID,
		Description:       task.Description,
		DueDate:           task.DueDate,
		Position:          task.Position,
		Status:            task.Status,
		CreatedAt:         task.CreatedAt,
		AssigneeFirstName: task.AssigneeFirstName,
		AssigneeLastName:  task.AssigneeLastName,
	}
}
