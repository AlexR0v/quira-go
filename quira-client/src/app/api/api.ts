import { axiosQuery } from '@/app/api/api-config.ts'
import { TSignInRequest, TSignInResponse, TSignUpRequest, TSignUpResponse } from '@/models/auth.ts'
import { TUser } from '@/models/user.ts'
import { ResponseWorkspace, TCreateWorkspaceRequest, TUpdateWorkspaceRequest, TWorkspace } from "@/models/worksapce.ts";
import { RequestParamsPagination } from "@/app/api/types.ts";
import { ResponseMembers, TMemberDelete, TMemberJoin, TMemberUpdateRole } from "@/models/members.ts";
import { ResponseProject, TCreateProjectRequest, TProject, TUpdateProjectRequest } from "@/models/project.ts";
import { RequestParamsTasks, ResponseTask, TCreateTaskRequest, TTask, TUpdateTaskRequest } from "@/models/task.ts";

export const api = {
    auth: {
        signIn: (data: TSignInRequest) => axiosQuery.post<TSignInResponse>('/auth/sign-in', data)
            .then(res => res.data),
        signUp: (data: TSignUpRequest): Promise<TSignUpResponse> => axiosQuery.post<TSignUpResponse>('/auth/sign-up', data)
            .then(res => res.data),
        logout: () => axiosQuery.get('/auth/logout')
            .then(res => res.data),
    },
    user: {
        getCurrentUser: () => axiosQuery.get<{ data: TUser, message: string, status: string }>('/users/me')
            .then(res => res.data.data),
    },
    workspace: {
        create: (data: TCreateWorkspaceRequest) => axiosQuery.post<{
            data: TWorkspace,
            message: string,
            status: string
        }>('/workspaces', data)
            .then(res => res.data),
        list: (params: RequestParamsPagination, signal?: AbortSignal) => axiosQuery.get<{
            data: ResponseWorkspace
        }>('/workspaces', {params, signal})
            .then(res => res.data.data),
        deleteWS: (id: string) => axiosQuery.delete(`/workspaces/${id}`)
            .then(res => res.data),
        getById: (id: string, signal?: AbortSignal) => axiosQuery.get<{
            data: TWorkspace
        }>(`/workspaces/${id}`, {signal}),
        update: (data: TUpdateWorkspaceRequest) => axiosQuery.patch<{
            data: TWorkspace,
            message: string,
            status: string
        }>('/workspaces', data)
            .then(res => res.data),
    },
    members: {
        join: (data: TMemberJoin) => axiosQuery.post<{
            data: TWorkspace,
            message: string,
            status: string
        }>('/members/join', data)
            .then(res => res.data),
        getList: (workspaceId: string, params: RequestParamsPagination, signal?: AbortSignal) => axiosQuery.get<{ data: ResponseMembers, message: string, status: string }>(`/members/${workspaceId}`, {params, signal})
            .then(res => res.data.data),
        updateRole: (data: TMemberUpdateRole) => axiosQuery.post<{
            data: string,
            message: string,
            status: string
        }>('/members/update-role', data),
        deleteMember: (data: TMemberDelete) => axiosQuery.delete(`/members/${data.workspace_id}/${data.user_id}`)
            .then(res => res.data),
    },
    project: {
        create: (data: TCreateProjectRequest) => axiosQuery.post<{
            data: TProject,
            message: string,
            status: string
        }>(`/${data.workspace_id}/projects`, data)
            .then(res => res.data),
        list: (params: RequestParamsPagination, workspaceId: string, signal?: AbortSignal) => axiosQuery.get<{
            data: ResponseProject
        }>(`/${workspaceId}/projects`, {params, signal})
            .then(res => res.data.data),
        delete: (id: string, workspace_id: string) => axiosQuery.delete(`${workspace_id}/projects/${id}`)
            .then(res => res.data),
        getById: (id: string, workspace_id: string, signal?: AbortSignal) => axiosQuery.get<{
            data: TProject
        }>(`/${workspace_id}/projects/${id}`, {signal}),
        update: (data: TUpdateProjectRequest) => axiosQuery.patch<{
            data: TProject,
            message: string,
            status: string
        }>(`/${data.workspace_id}/projects`, data)
            .then(res => res.data),
    },
    tasks: {
        create: (data: TCreateTaskRequest) => axiosQuery.post<{
            data: TTask,
            message: string,
            status: string
        }>('/tasks', data)
            .then(res => res.data),
        list: (params: RequestParamsTasks, signal?: AbortSignal) => axiosQuery.get<{
            data: ResponseTask
        }>('/tasks', {params, signal})
            .then(res => res.data.data),
        delete: (id: string) => axiosQuery.delete(`/tasks/${id}`)
            .then(res => res.data),
        getById: (id: string, signal?: AbortSignal) => axiosQuery.get<{
            data: TTask
        }>(`/tasks/${id}`, {signal}),
        update: (data: TUpdateTaskRequest) => axiosQuery.patch<{
            data: TTask,
            message: string,
            status: string
        }>('/tasks', data)
            .then(res => res.data),
    },
}