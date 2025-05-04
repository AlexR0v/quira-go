package workspaces

import (
	"github.com/jackc/pgx/v5/pgtype"
)

type Workspace struct {
	Name       string           `json:"name"`
	UserID     string           `json:"user_id"`
	Image      string           `json:"image"`
	CreatedAt  pgtype.Timestamp `json:"created_at"`
	InviteCode string           `json:"invite_code"`
	ID         any              `json:"id"`
}

type WorkspaceResponse struct {
	Name       string           `json:"name"`
	UserID     any              `json:"user_id"`
	Image      string           `json:"image"`
	CreatedAt  pgtype.Timestamp `json:"created_at"`
	InviteCode string           `json:"invite_code"`
	ID         any              `json:"id"`
}

type ResponseAnalytics struct {
	TotalCountAll       int `json:"total_count_all"`
	TotalCountAllDiff   int `json:"total_count_all_difference"`
	CountAssigned       int `json:"count_assigned"`
	CountAssignedDiff   int `json:"count_assigned_difference"`
	CountIncomplete     int `json:"count_incomplete"`
	CountIncompleteDiff int `json:"count_incomplete_difference"`
	CountComplete       int `json:"count_complete"`
	CountCompleteDiff   int `json:"count_complete_difference"`
	CountOverdue        int `json:"count_overdue"`
	CountOverdueDiff    int `json:"count_overdue_difference"`
}

type ResponseList struct {
	TotalCount int                  `json:"total_count"`
	Workspaces []*WorkspaceResponse `json:"workspaces"`
}

type CreateInput struct {
	Name       string `json:"name"`
	Image      string `json:"image"`
	InviteCode string `json:"invite_code"`
}

type UpdateInput struct {
	ID         any    `json:"id"`
	Name       string `json:"name"`
	Image      string `json:"image"`
	InviteCode string `json:"invite_code"`
}

func MapWorkspace(workspace Workspace) *WorkspaceResponse {
	return &WorkspaceResponse{
		ID:         workspace.ID,
		CreatedAt:  workspace.CreatedAt,
		Name:       workspace.Name,
		UserID:     workspace.UserID,
		InviteCode: workspace.InviteCode,
		Image:      workspace.Image,
	}
}
