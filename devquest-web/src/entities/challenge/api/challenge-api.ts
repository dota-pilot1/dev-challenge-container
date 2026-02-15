import { mainApi } from '@/shared/api/client'
import type { Challenge, CreateChallengeRequest } from '../model'

export const challengesApi = {
  findAll: () => mainApi.get<Challenge[]>('/challenges'),
  findById: (id: number) => mainApi.get<Challenge>(`/challenges/${id}`),
  create: (data: CreateChallengeRequest) => mainApi.post<Challenge>('/challenges', data),
}
