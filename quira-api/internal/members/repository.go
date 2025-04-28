package members

import (
	"context"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/zerolog"
	"quira-api/internal/workspaces"
	"time"
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

func (r *Repository) JoinMember(ws workspaces.Workspace, userId string) error {
	queryMembers := "INSERT INTO members (user_id, role, workspace_id) VALUES (@user_id, @role, @workspace_id)"
	argsMem := pgx.NamedArgs{
		"user_id":      userId,
		"role":         "ADMIN",
		"created_at":   time.Now(),
		"workspace_id": ws.ID,
	}
	rows, errMembers := r.db.Query(context.Background(), queryMembers, argsMem)
	if errMembers != nil {
		r.logger.Error().Msg(errMembers.Error())
		return errMembers
	}
	defer rows.Close()
	return nil
}
