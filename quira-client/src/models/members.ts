import {TUser} from "@/models/user.ts";

export enum RoleMember {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export type TMemberJoin = {
    workspace_id: string,
    invite_code: string
}

export type TMemberUpdateRole = {
    workspace_id: string,
    user_id: string
    role: RoleMember
}

export type TMemberDelete = {
    workspace_id: string,
    user_id: string
}

export type ResponseMembers = {
    users: TUser[]
    total_count: number
}