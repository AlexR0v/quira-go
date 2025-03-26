package user

import (
	"context"
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

func (r *Repository) FindAllUsers() ([]User, error) {
	query := "SELECT id, email, last_name, first_name FROM users"
	rows, err := r.db.Query(context.Background(), query)
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return nil, err
	}
	defer rows.Close()
	var users []User
	for rows.Next() {
		var user User
		err := rows.Scan(&user.ID, &user.Email, &user.LastName, &user.FirstName)
		if err != nil {
			r.logger.Error().Msg(err.Error())
			return nil, err
		}
		users = append(users, user)
	}
	return users, nil
}

func (r *Repository) FindUserByEmail(email string) (User, error) {
	query := "SELECT id, email, last_name, first_name, password FROM users WHERE email = $1"
	row := r.db.QueryRow(context.Background(), query, email)
	var user User
	err := row.Scan(&user.ID, &user.Email, &user.LastName, &user.FirstName, &user.Password)
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
