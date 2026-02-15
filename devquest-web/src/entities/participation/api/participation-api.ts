import { mainApi } from "@/shared/api/client";
import type {
  Participation,
  CreateParticipationRequest,
  SubmitRequest,
  ApprovalHistory,
} from "../model";

export const participationsApi = {
  findAll: () => mainApi.get<Participation[]>("/participations"),
  findById: (id: number) => mainApi.get<Participation>(`/participations/${id}`),
  findByChallengeId: (challengeId: number) =>
    mainApi.get<Participation[]>(`/participations/challenge/${challengeId}`),
  apply: (data: CreateParticipationRequest) =>
    mainApi.post<Participation>("/participations", data),
  submit: (id: number, data: SubmitRequest) =>
    mainApi.patch<Participation>(`/participations/${id}/submit`, data),
  approve: (id: number) =>
    mainApi.patch<Participation>(`/participations/${id}/approve`),
  retryApprove: (id: number) =>
    mainApi.patch<Participation>(`/participations/${id}/retry-approve`),
  reject: (id: number) =>
    mainApi.patch<Participation>(`/participations/${id}/reject`),
  cancel: (id: number) => mainApi.delete(`/participations/${id}`),
  getApprovalHistory: (id: number) =>
    mainApi.get<ApprovalHistory[]>(`/participations/${id}/approval-history`),
};
