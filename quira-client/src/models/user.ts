export type TUser = {
  email: string
  username: string
  id: number
  role: Role
}

export enum Role {
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN'
}