import {api} from '@/app/api/api.ts'
import {useToast} from '@/hooks/use-toast.ts'
import {TSignInRequest} from '@/models/auth.ts'
import {TError} from '@/models/TError.ts'
import {useMutation} from '@tanstack/react-query'
import {AxiosError} from 'axios'
//import {useNavigate} from 'react-router'

export const useAuth = () => {
  const { toast } = useToast()
  //const navigate = useNavigate()
  
  return useMutation({
    mutationFn: (data: TSignInRequest) => api.auth.signIn(data),
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token)
      //navigate('/')
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