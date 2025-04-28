export enum RoleMember {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export type TMemberJoin = {
    workspace_id: string,
    invite_code: string
}