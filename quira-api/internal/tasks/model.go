package tasks

import (
	"time"
	
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

type TaskSingle struct {
	Name              string           `json:"name"`
	WorkspaceID       string           `json:"workspace_id"`
	WorkspaceName     string           `json:"workspace_name"`
	ProjectID         string           `json:"project_id"`
	ProjectName       string           `json:"project_name"`
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

type TaskListParams struct {
	limit         int
	offset        int
	projectId     string
	userId        string
	currentUserId string
	status        string
	name          string
	sortField     string
	sortOrder     string
	dueDate       *time.Time
}

type ResponseType struct {
	Tasks               []Task
	Total               int
	TotalCountAll       int
	TotalCountAllDiff   int
	CountAssigned       int
	CountAssignedDiff   int
	CountIncomplete     int
	CountIncompleteDiff int
	CountCompleteDiff   int
	CountComplete       int
	CountOverdue        int
	CountOverdueDiff    int
	Err                 error
}

type ResponseList struct {
	TotalCount          int             `json:"total_count"`
	TotalCountAll       int             `json:"total_count_all"`
	TotalCountAllDiff   int             `json:"total_count_all_difference"`
	CountAssigned       int             `json:"count_assigned"`
	CountAssignedDiff   int             `json:"count_assigned_difference"`
	CountIncomplete     int             `json:"count_incomplete"`
	CountIncompleteDiff int             `json:"count_incomplete_difference"`
	CountComplete       int             `json:"count_complete"`
	CountCompleteDiff   int             `json:"count_complete_difference"`
	CountOverdue        int             `json:"count_overdue"`
	CountOverdueDiff    int             `json:"count_overdue_difference"`
	Tasks               []*TaskResponse `json:"tasks"`
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
