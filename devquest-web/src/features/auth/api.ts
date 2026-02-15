import { mainApi } from '@/shared/api/client'
import type { AuthResponse, LoginRequest, SignupRequest } from './model'

export const authApi = {
  login: (data: LoginRequest) => mainApi.post<AuthResponse>('/auth/login', data),
  signup: (data: SignupRequest) => mainApi.post<AuthResponse>('/auth/signup', data),
}
