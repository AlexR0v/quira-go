package projects

import (
	"github.com/jackc/pgx/v5/pgtype"
)

type Project struct {
	Name        string           `json:"name"`
	WorkspaceID string           `json:"workspace_id"`
	Image       string           `json:"image"`
	CreatedAt   pgtype.Timestamp `json:"created_at"`
	ID          any              `json:"id"`
}

type ProjectResponse struct {
	Name        string           `json:"name"`
	WorkspaceID string           `json:"workspace_id"`
	Image       string           `json:"image"`
	CreatedAt   pgtype.Timestamp `json:"created_at"`
	ID          any              `json:"id"`
}

type ResponseList struct {
	TotalCount int                `json:"total_count"`
	Projects   []*ProjectResponse `json:"projects"`
}

type CreateInput struct {
	Name        string `json:"name"`
	Image       string `json:"image"`
	WorkspaceID string `json:"workspace_id"`
}

type UpdateInput struct {
	ID    any    `json:"id"`
	Name  string `json:"name"`
	Image string `json:"image"`
}

func MapProject(project Project) *ProjectResponse {
	return &ProjectResponse{
		ID:          project.ID,
		CreatedAt:   project.CreatedAt,
		Name:        project.Name,
		WorkspaceID: project.WorkspaceID,
		Image:       project.Image,
	}
}
