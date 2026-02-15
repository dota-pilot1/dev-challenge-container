export interface Participation {
  id: number;
  challengeId: number;
  userId: number;
  status: string;
  submissionUrl: string | null;
  submittedAt: string | null;
  orderId: number | null;
  nickname: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateParticipationRequest {
  challengeId: number;
  userId: number;
}

export interface SubmitRequest {
  submissionUrl: string;
}
