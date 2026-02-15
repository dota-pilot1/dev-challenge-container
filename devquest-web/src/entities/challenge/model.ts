export interface Challenge {
  id: number;
  title: string;
  description: string | null;
  rewardProductId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChallengeRequest {
  title: string;
  description?: string;
  rewardProductId: number;
}
