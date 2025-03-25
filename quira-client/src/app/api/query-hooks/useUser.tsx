import { api }      from '@/app/api/api.ts'
import { useQuery } from '@tanstack/react-query'

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ['current_user'],
    queryFn: () => api.user.getCurrentUser(),
  })
}