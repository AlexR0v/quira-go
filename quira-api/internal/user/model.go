package user

type User struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Role      string `json:"role"`
	Password  string `json:"password"`
	Email     string `json:"email"`
	ID        any
}
