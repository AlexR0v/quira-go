package workspaces

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/zerolog"
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

func (r *Repository) CountWorkspaces(userId string) int {
	query := "SELECT count(id) from workspaces where user_id = $1"
	var countWorkspaces int
	err := r.db.QueryRow(context.Background(), query, userId).Scan(&countWorkspaces)
	if err != nil {
		return 0
	}
	return countWorkspaces
}

func (r *Repository) FindAll(limit, offset int, userId string) ([]Workspace, int, error) {
	query := "SELECT id, name, image, created_at, user_id FROM workspaces where workspaces.user_id = $3 order by created_at limit $1 offset $2"
	rows, err := r.db.Query(context.Background(), query, limit, offset, userId)
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return nil, 0, err
	}
	defer rows.Close()
	workspaces, err := pgx.CollectRows(rows, pgx.RowToStructByName[Workspace])
	countWorkspaces := r.CountWorkspaces(userId)

	if err != nil {
		r.logger.Error().Msg(err.Error())
		return nil, 0, err
	}

	return workspaces, countWorkspaces, nil
}

func (r *Repository) FindById(id string) (Workspace, error) {
	query := "SELECT id, name, image, created_at FROM workspaces WHERE id = $1"
	row := r.db.QueryRow(context.Background(), query, id)
	var workspace Workspace
	err := row.Scan(&workspace.ID, &workspace.Name, &workspace.Image, &workspace.CreatedAt)
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return Workspace{}, err
	}
	return workspace, nil
}

func (r *Repository) Create(newWorkspace Workspace) (Workspace, error) {
	query := "INSERT INTO workspaces (name, user_id, created_at, image) VALUES (@name, @user_id, @created_at, @image) RETURNING id"
	args := pgx.NamedArgs{
		"name":       newWorkspace.Name,
		"user_id":    newWorkspace.UserID,
		"created_at": time.Now(),
		"image":      newWorkspace.Image,
	}
	_, err := r.db.Exec(context.Background(), query, args)
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return Workspace{}, err
	}

	var workspace Workspace
	// err = r.db.QueryRow(context.Background(), query, args).Scan(&workspace.ID, &workspace.Name, &workspace.CreatedAt)
	// if err != nil {
	// 	r.logger.Error().Msg(err.Error())
	// 	return Workspace{}, err
	// }
	return workspace, nil
}

func (r *Repository) DeleteById(id string) error {
	query := "DELETE FROM workspaces WHERE id = $1"
	_, err := r.db.Query(context.Background(), query, id)
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return err
	}
	return nil
}
