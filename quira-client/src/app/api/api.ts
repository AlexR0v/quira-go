import {axiosQuery} from '@/app/api/api-config.ts'
import {TSignInRequest, TSignInResponse, TSignUpRequest, TSignUpResponse} from '@/models/auth.ts'
import {TUser} from '@/models/user.ts'
import {ResponseWorkspace, TCreateWorkspaceRequest, TWorkspace} from "@/models/worksapce.ts";
import {RequestParamsPagination} from "@/app/api/types.ts";

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
    },
}