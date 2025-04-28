import {api} from '@/app/api/api.ts'
import {useToast} from '@/hooks/use-toast.ts'
import {TError} from '@/models/TError.ts'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {AxiosError} from 'axios'
import {TCreateWorkspaceRequest, TUpdateWorkspaceRequest} from "@/models/worksapce.ts";
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
        description: "Проект успешно создан",
      })
      queryClient.invalidateQueries({queryKey: ['workspace_list']})
      queryClient.invalidateQueries({queryKey: ['members_list']})
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

export const useGetWorkSpace = (id?: string) => {
  return useQuery({
    queryKey: ['workspace', id],
    queryFn: () => id ? api.workspace.getById(id) : null,
    enabled: !!id,
  })
}

export const useWorkSpaceDelete = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.workspace.deleteWS(id),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Успех',
        description: "Проект успешно удален",
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

export const useWorkSpaceUpdate = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TUpdateWorkspaceRequest) => api.workspace.update(data),
    onSuccess: (_, variables) => {
      toast({
        variant: 'success',
        title: 'Успех',
        description: "Проект успешно обновлен",
      })
      queryClient.invalidateQueries({queryKey: ['workspace', variables.id]})
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

