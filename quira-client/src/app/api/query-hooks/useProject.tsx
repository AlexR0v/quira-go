import {api} from '@/app/api/api.ts'
import {useToast} from '@/hooks/use-toast.ts'
import {TError} from '@/models/TError.ts'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {AxiosError} from 'axios'
import {RequestParamsPagination} from "@/app/api/types.ts";
import {TCreateProjectRequest, TUpdateProjectRequest} from "@/models/project.ts";

export const useProjectCreate = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TCreateProjectRequest) => api.project.create(data),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Успех',
        description: "Проект успешно создан",
      })
      queryClient.invalidateQueries({queryKey: ['projects_list']})
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

export const useProjectList = (params: RequestParamsPagination, workspaceId?: string) => {
  return useQuery({
    queryKey: ['projects_list', workspaceId],
    queryFn: ({signal}) => api.project.list(params, workspaceId ?? "", signal),
    enabled: !!workspaceId,
  })
}

export const useGetProject = (id?: string, workspaceId?: string) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => id && workspaceId ? api.project.getById(id, workspaceId) : null,
    enabled: !!id && !!workspaceId,
  })
}

export const useProjectDelete = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({id, workspace_id}: { id: string, workspace_id: string }) => api.project.delete(id, workspace_id),
    onSuccess: (_, variables) => {
      toast({
        variant: 'success',
        title: 'Успех',
        description: "Проект успешно удален",
      })
      queryClient.invalidateQueries({queryKey: ['projects_list', variables.workspace_id]})
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

export const useProjectUpdate = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TUpdateProjectRequest) => api.project.update(data),
    onSuccess: (_, variables) => {
      toast({
        variant: 'success',
        title: 'Успех',
        description: "Проект успешно обновлен",
      })
      queryClient.invalidateQueries({queryKey: ['project', variables.id]})
      queryClient.invalidateQueries({queryKey: ['projects_list', variables.workspace_id]})
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

