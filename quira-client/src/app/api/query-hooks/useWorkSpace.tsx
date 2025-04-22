import {api} from '@/app/api/api.ts'
import {useToast} from '@/hooks/use-toast.ts'
import {TError} from '@/models/TError.ts'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {AxiosError} from 'axios'
import {TCreateWorkspaceRequest} from "@/models/worksapce.ts";
import {RequestParamsPagination} from "@/app/api/types.ts";

export const useWorkSpaceCreate = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TCreateWorkspaceRequest) => api.workspace.create(data),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Успех',
        description: "Рабочее пространство успешно создано",
      })
      queryClient.invalidateQueries({queryKey: ['workspace_list']})
    },
    onError: (error: AxiosError<TError>) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error.response?.data.message ?? 'Что-то пошло не так. Попробуйте позже',
      })
    },
  })
}

export const useWorkSpaceList = (params: RequestParamsPagination) => {
  return useQuery({
    queryKey: ['workspace_list'],
    queryFn: () => api.workspace.list(params),
  })
}

export const useWorkSpaceDelete = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => api.workspace.deleteWS(id),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Успех',
        description: "Рабочее пространство успешно удалено",
      })
      queryClient.invalidateQueries({queryKey: ['workspace_list']})
    },
    onError: (error: AxiosError<TError>) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error.response?.data.message ?? 'Что-то пошло не так. Попробуйте позже',
      })
    },
  })
}

