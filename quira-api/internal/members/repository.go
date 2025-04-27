package members

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pkg/errors"
	"github.com/rs/zerolog"

	"quira-api/internal/user"
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

func (r *Repository) FindById(id string) (Member, error) {
	query := "SELECT id, user_id, workspace_id, role, created_at FROM members WHERE id = $1"
	row := r.db.QueryRow(context.Background(), query, id)
	var member Member
	err := row.Scan(&member.ID, &member.UserId, &member.WorkspaceId, &member.Role, &member.CreatedAt)
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return Member{}, err
	}
	return member, nil
}

func (r *Repository) Create(user user.User) (Member, error) {
	queryMember := "INSERT INTO members (user_id, role) VALUES (@user_id, @role) returning id, user_id, workspace_id, role, created_at"
	argsMember := pgx.NamedArgs{
		"user_id":    user.ID,
		"role":       user.Role,
		"created_at": time.Now(),
	}
	var member Member
	row := r.db.QueryRow(context.Background(), queryMember, argsMember).Scan(
		&member.ID,
		&member.UserId,
		&member.WorkspaceId,
		&member.Role,
		&member.CreatedAt,
	)
	if row != nil {
		r.logger.Error().Msg(row.Error())
		return Member{}, errors.New(row.Error())
	}

	return member, nil
}
