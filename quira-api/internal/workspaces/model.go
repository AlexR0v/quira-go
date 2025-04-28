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
	ID         any
}

type WorkspaceResponse struct {
	Name       string           `json:"name"`
	UserID     any              `json:"user_id"`
	Image      string           `json:"image"`
	CreatedAt  pgtype.Timestamp `json:"created_at"`
	InviteCode string           `json:"invite_code"`
	ID         any              `json:"id"`
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
