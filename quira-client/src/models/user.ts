export type TUser = {
    first_name: string
    last_name: string
    role: Role
    email: string
    created_at: Date
    id: number
}

export enum Role {
    ROLE_USER = 'ROLE_USER',
    ROLE_ADMIN = 'ROLE_ADMIN'
}