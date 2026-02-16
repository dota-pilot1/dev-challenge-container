export interface Member {
  id: number;
  email: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberRow {
  id?: number;
  email: string;
  nickname: string;
  status: "C" | "U" | "D";
}

export interface MemberSaveRequest {
  rows: MemberRow[];
}
