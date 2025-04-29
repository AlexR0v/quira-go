import {useToast} from "@/hooks/use-toast.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {api} from "@/app/api/api.ts";
import {AxiosError} from "axios";
import {TError} from "@/models/TError.ts";
import {TMemberDelete, TMemberJoin, TMemberUpdateRole} from "@/models/members.ts";
import {useNavigate} from "react-router";
import {RequestParamsPagination} from "@/app/api/types.ts";

export const useMemberJoin = () => {
    const {toast} = useToast()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: (data: TMemberJoin) => api.members.join(data),
        onSuccess: ({data}) => {
            toast({
                variant: 'success',
                title: 'Успех',
                description: "Вы присоединились к проекту",
            })
            navigate(`/workspaces/${data.id}`)
        },
        onError: (error: AxiosError<TError>) => {
            toast({
                variant: 'destructive',
                title: 'Ошибка',
                description: error?.response?.data?.message ?? 'Что-то пошло не так. Попробуйте позже',
            })
        },
    })
}

export const useMembersList = (params: RequestParamsPagination, workspaceId?: string) => {
    return useQuery({
        queryKey: ['members_list'],
        queryFn: ({signal}) => api.members.getList(workspaceId ?? "", params, signal),
        enabled: !!workspaceId,
    })
}

export const useMemberUpdateRole = () => {
    const {toast} = useToast()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: TMemberUpdateRole) => api.members.updateRole(data),
        onSuccess: (_, variables) => {
            toast({
                variant: 'success',
                title: 'Успех',
                description: "Роль успешно обновлена",
            })
            queryClient.invalidateQueries({queryKey: ['workspace_list']})
            queryClient.invalidateQueries({queryKey: ['members_list']})
            queryClient.invalidateQueries({queryKey: ['workspace', variables.workspace_id]})
        },
        onError: (error: AxiosError<TError>) => {
            toast({
                variant: 'destructive',
                title: 'Ошибка',
                description: error?.response?.data?.message ?? 'Что-то пошло не так. Попробуйте позже',
            })
        },
    })
}

export const useMemberDelete = () => {
    const {toast} = useToast()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: TMemberDelete) => api.members.deleteMember(data),
        onSuccess: (_, variables) => {
            toast({
                variant: 'success',
                title: 'Успех',
                description: "Участник успешно удален",
            })
            queryClient.invalidateQueries({queryKey: ['workspace_list']})
            queryClient.invalidateQueries({queryKey: ['members_list']})
            queryClient.invalidateQueries({queryKey: ['workspace', variables.workspace_id]})
        },
        onError: (error: AxiosError<TError>) => {
            toast({
                variant: 'destructive',
                title: 'Ошибка',
                description: error?.response?.data?.message ?? 'Что-то пошло не так. Попробуйте позже',
            })
        },
    })
}