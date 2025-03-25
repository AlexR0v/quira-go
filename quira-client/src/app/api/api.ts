import { axiosQuery }                                                       from '@/app/api/api-config.ts'
import { TSignInRequest, TSignInResponse, TSignUpRequest, TSignUpResponse } from '@/models/auth.ts'
import { TUser }                                                            from '@/models/user.ts'

export const api = {
  auth: {
    signIn: (data: TSignInRequest) => axiosQuery.post<TSignInResponse>('/auth/sign-in', data)
      .then(res => res.data),
    signUp: (data: TSignUpRequest): Promise<TSignUpResponse> => axiosQuery.post<TSignUpResponse>('/auth/sign-up', data)
      .then(res => res.data),
  },
  user: {
    getCurrentUser: () => axiosQuery.get<TUser>('/user/current')
      .then(res => res.data),
  },
}