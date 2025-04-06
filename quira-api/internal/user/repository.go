package user

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

func (r *Repository) CountUsers() int {
	query := "SELECT count(id) from users"
	var countUsers int
	err := r.db.QueryRow(context.Background(), query).Scan(&countUsers)
	if err != nil {
		return 0
	}
	return countUsers
}

func (r *Repository) FindAllUsers(limit, offset int) ([]User, int, error) {
	query := "SELECT id, email, password, role, last_name, first_name, created_at FROM users order by created_at limit $1 offset $2"
	rows, err := r.db.Query(context.Background(), query, limit, offset)
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return nil, 0, err
	}
	defer rows.Close()
	users, err := pgx.CollectRows(rows, pgx.RowToStructByName[User])
	countUsers := r.CountUsers()

	if err != nil {
		r.logger.Error().Msg(err.Error())
		return nil, 0, err
	}

	return users, countUsers, nil
}

func (r *Repository) FindUserByEmail(email string) (User, error) {
	query := "SELECT id, email, role, last_name, first_name, password, created_at FROM users WHERE email = $1"
	row := r.db.QueryRow(context.Background(), query, email)
	var user User
	err := row.Scan(&user.ID, &user.Email, &user.Role, &user.LastName, &user.FirstName, &user.Password, &user.CreatedAt)
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return User{}, err
	}
	return user, nil
}

func (r *Repository) FindUserById(id string) (User, error) {
	query := "SELECT id, email, role, last_name, first_name, password, created_at FROM users WHERE id = $1"
	row := r.db.QueryRow(context.Background(), query, id)
	var user User
	err := row.Scan(&user.ID, &user.Email, &user.Role, &user.LastName, &user.FirstName, &user.Password, &user.CreatedAt)
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return User{}, err
	}
	return user, nil
}

func (r *Repository) CreateUser(newUser User) (User, error) {
	query := "INSERT INTO users (email, last_name, first_name, password, role) VALUES (@email, @last_name, @first_name, @password, @role)"
	args := pgx.NamedArgs{
		"email":      newUser.Email,
		"last_name":  newUser.LastName,
		"first_name": newUser.FirstName,
		"password":   newUser.Password,
		"role":       newUser.Role,
		"created_at": time.Now(),
	}

	_, err := r.db.Exec(context.Background(), query, args)
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return User{}, err
	}
	user, err := r.FindUserByEmail(newUser.Email)
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return User{}, err
	}
	return user, nil
}
