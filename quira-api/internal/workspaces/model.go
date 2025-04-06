package workspaces

import (
	"github.com/jackc/pgx/v5/pgtype"
)

type Workspace struct {
	Name      string           `json:"name"`
	UserID    string           `json:"user_id"`
	Image     string           `json:"image"`
	CreatedAt pgtype.Timestamp `json:"created_at"`
	ID        any
}

type WorkspaceResponse struct {
	Name      string           `json:"name"`
	UserID    string           `json:"user_id"`
	Image     string           `json:"image"`
	CreatedAt pgtype.Timestamp `json:"created_at"`
	ID        any              `json:"id"`
}

type ResponseList struct {
	TotalCount int                  `json:"total_count"`
	Workspaces []*WorkspaceResponse `json:"workspaces"`
}

type CreateInput struct {
	Name  string `json:"name"`
	Image string `json:"image"`
}

func mapWorkspace(workspace Workspace) *WorkspaceResponse {
	return &WorkspaceResponse{
		ID:        workspace.ID,
		CreatedAt: workspace.CreatedAt,
		Name:      workspace.Name,
		UserID:    workspace.UserID,
		Image:     workspace.Image,
	}
}
