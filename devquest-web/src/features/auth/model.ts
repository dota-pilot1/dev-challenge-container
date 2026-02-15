export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  nickname: string;
}
