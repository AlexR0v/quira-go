package members

type InputJoin struct {
	WorkspaceID any    `json:"workspace_id"`
	InviteCode  string `json:"invite_code"`
}

type InputUpdateRole struct {
	Role        string `json:"role"`
	UserId      string `json:"user_id"`
	WorkspaceId string `json:"workspace_id"`
}
