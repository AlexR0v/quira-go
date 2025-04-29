package members

import (
	"context"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/zerolog"
	"quira-api/internal/user"
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
		"role":         "USER",
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

func (r *Repository) DeleteMember(userId string, workspaceId string) error {
	query := "DELETE FROM members WHERE user_id = $1 AND workspace_id = $2"
	_, err := r.db.Exec(context.Background(), query, userId, workspaceId)
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return err
	}
	return nil
}

func (r *Repository) CountMembers(workspaceId string) int {
	query := "SELECT count(u.id) from users u JOIN  members m ON u.id = m.user_id where m.workspace_id = $1"
	var countMembers int
	err := r.db.QueryRow(context.Background(), query, workspaceId).Scan(&countMembers)
	if err != nil {
		return 0
	}
	return countMembers
}

func (r *Repository) FindAll(limit, offset int, workspaceId string) ([]user.User, int, error) {
	query := "SELECT u.id, u.first_name, u.last_name, u.email, u.created_at, m.role, u.password FROM users u JOIN  members m ON u.id = m.user_id where m.workspace_id = $3 order by m.created_at desc limit $1 offset $2"
	rows, err := r.db.Query(context.Background(), query, limit, offset, workspaceId)
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return nil, 0, err
	}
	defer rows.Close()
	users, err := pgx.CollectRows(rows, pgx.RowToStructByName[user.User])
	countUsers := r.CountMembers(workspaceId)

	if err != nil {
		r.logger.Error().Msg(err.Error())
		return nil, 0, err
	}

	return users, countUsers, nil
}

func (r *Repository) UpdateRole(input InputUpdateRole) error {
	query := "UPDATE members SET role = @role WHERE user_id = @user_id AND workspace_id = @workspace_id"
	args := pgx.NamedArgs{
		"role":         input.Role,
		"user_id":      input.UserId,
		"workspace_id": input.WorkspaceId,
	}
	row, err := r.db.Query(context.Background(), query, args)
	defer row.Close()
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return err
	}

	return nil
}
