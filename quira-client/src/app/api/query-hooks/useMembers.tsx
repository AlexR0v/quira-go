import {useToast} from "@/hooks/use-toast.ts";
import {useMutation, useQuery} from "@tanstack/react-query";
import {api} from "@/app/api/api.ts";
import {AxiosError} from "axios";
import {TError} from "@/models/TError.ts";
import {TMemberJoin} from "@/models/members.ts";
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
            console.log(error);
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