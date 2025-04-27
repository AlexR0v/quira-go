package members

import (
	"github.com/jackc/pgx/v5/pgtype"
)

type Member struct {
	UserId      any              `json:"user_id" db:"user_id"`
	WorkspaceId any              `json:"workspace_id" db:"workspace_id"`
	Role        string           `json:"role"`
	CreatedAt   pgtype.Timestamp `json:"created_at"`
	ID          any
}

type ResponseMember struct {
	UserId      any              `json:"user_id"`
	WorkspaceId any              `json:"workspace_id"`
	Role        string           `json:"role"`
	CreatedAt   pgtype.Timestamp `json:"created_at"`
	ID          any              `json:"id"`
}

type Response struct {
	TotalCount int `json:"total_count"`
	Users      []*ResponseMember
}

func mapMember(user Member) *ResponseMember {
	return &ResponseMember{
		ID:          user.ID,
		CreatedAt:   user.CreatedAt,
		Role:        user.Role,
		UserId:      user.UserId,
		WorkspaceId: user.WorkspaceId,
	}
}
