package projects

import (
	"context"
	"strconv"
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

func (r *Repository) Count(workspaceId string) int {
	query := "SELECT count(id) from projects where workspace_id = $1"
	var count int
	err := r.db.QueryRow(context.Background(), query, workspaceId).Scan(&count)
	if err != nil {
		return 0
	}
	return count
}

func (r *Repository) FindAll(limit, offset int, workspaceId string) ([]Project, int, error) {
	query := "SELECT p.* FROM projects p where p.workspace_id = $3 order by p.created_at desc limit $1 offset $2"
	rows, err := r.db.Query(context.Background(), query, limit, offset, workspaceId)
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return nil, 0, err
	}
	defer rows.Close()
	projects, err := pgx.CollectRows(rows, pgx.RowToStructByName[Project])
	count := r.Count(workspaceId)

	if err != nil {
		r.logger.Error().Msg(err.Error())
		return nil, 0, err
	}

	return projects, count, nil
}

func (r *Repository) FindById(id string) (Project, error) {
	query := "SELECT p.id, p.name, p.workspace_id, p.created_at, p.image FROM projects p WHERE id = $1"
	row := r.db.QueryRow(context.Background(), query, id)
	var project Project
	err := row.Scan(
		&project.ID,
		&project.Name,
		&project.WorkspaceID,
		&project.CreatedAt,
		&project.Image,
	)
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return Project{}, err
	}
	return project, nil
}

func (r *Repository) Create(newProject Project) (Project, error) {
	query := "INSERT INTO projects (name, workspace_id, created_at, image) VALUES (@name, @workspace_id, @created_at, @image) returning id"
	args := pgx.NamedArgs{
		"name":         newProject.Name,
		"workspace_id": newProject.WorkspaceID,
		"created_at":   time.Now(),
		"image":        newProject.Image,
	}
	row := r.db.QueryRow(context.Background(), query, args)
	var projectId int64
	err := row.Scan(&projectId)
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return Project{}, err
	}

	project, err := r.FindById(strconv.FormatInt(projectId, 10))
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return Project{}, err
	}
	return project, nil
}

func (r *Repository) DeleteById(id string) error {
	query := "DELETE FROM projects WHERE id = $1"
	_, err := r.db.Exec(context.Background(), query, id)
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return err
	}
	return nil
}

func (r *Repository) Update(ws *UpdateInput) (Project, error) {
	query := "UPDATE projects SET name = @name, image = @image WHERE id = @id RETURNING id"
	args := pgx.NamedArgs{
		"name":  ws.Name,
		"image": ws.Image,
		"id":    ws.ID,
	}
	row := r.db.QueryRow(context.Background(), query, args)
	var projectId int64
	err := row.Scan(&projectId)
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return Project{}, err
	}

	project, err := r.FindById(strconv.FormatInt(projectId, 10))
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return Project{}, err
	}

	return project, nil
}
