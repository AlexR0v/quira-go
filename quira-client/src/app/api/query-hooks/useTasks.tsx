import { api } from '@/app/api/api.ts'
import { useToast } from '@/hooks/use-toast.ts'
import { TError } from '@/models/TError.ts'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { RequestParamsTasks, TCreateTaskRequest, TUpdateTaskRequest } from "@/models/task.ts";

export const useTaskCreate = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TCreateTaskRequest) => api.tasks.create(data),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Успех',
        description: "Задача успешно создана",
      })
      queryClient.invalidateQueries({queryKey: ['tasks_list']})
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

export const useTasksList = (params: RequestParamsTasks) => {
  return useQuery({
    queryKey: ['tasks_list', params],
    queryFn: () => api.tasks.list(params),
  })
}

export const useGetTask = (id?: string) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => id ? api.tasks.getById(id) : null,
    enabled: !!id,
  })
}

export const useTaskDelete = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.tasks.delete(id),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Успех',
        description: "Задача успешно удалена",
      })
      queryClient.invalidateQueries({queryKey: ['tasks_list']})
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

export const useTaskUpdate = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TUpdateTaskRequest) => api.tasks.update(data),
    onSuccess: (_, variables) => {
      toast({
        variant: 'success',
        title: 'Успех',
        description: "Задача успешно обновлена",
      })
      queryClient.invalidateQueries({queryKey: ['task', variables.id]})
      queryClient.invalidateQueries({queryKey: ['tasks_list']})
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

