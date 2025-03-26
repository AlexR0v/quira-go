package user

import (
	"context"
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
	for _, user := range users {
		user.Password = "******"
	}
	return users, nil
}

func (r *Repository) FindUserByEmail(email string) (User, error) {
	query := "SELECT id, email, last_name, first_name FROM users WHERE email = $1"
	row := r.db.QueryRow(context.Background(), query, email)
	var user User
	err := row.Scan(&user.ID, &user.Email, &user.LastName, &user.FirstName)
	if err != nil {
		r.logger.Error().Msg(err.Error())
		return User{}, err
	}
	user.Password = "******"
	return user, nil
}
