package user

import (
	"github.com/jackc/pgx/v5/pgtype"
)

type User struct {
	FirstName string           `json:"first_name" db:"first_name"`
	LastName  string           `json:"last_name"`
	Role      string           `json:"role"`
	Password  string           `json:"password"`
	Email     string           `json:"email"`
	CreatedAt pgtype.Timestamp `json:"created_at"`
	ID        any
}

type ResponseUser struct {
	FirstName string           `json:"first_name"`
	LastName  string           `json:"last_name"`
	Role      string           `json:"role"`
	Email     string           `json:"email"`
	CreatedAt pgtype.Timestamp `json:"created_at"`
	ID        any              `json:"id"`
}

type Response struct {
	TotalCount int `json:"total_count"`
	Users      []*ResponseUser
}

func mapUser(user User) *ResponseUser {
	return &ResponseUser{
		ID:        user.ID,
		FirstName: user.FirstName,
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
		LastName:  user.LastName,
		Role:      user.Role,
	}
}
