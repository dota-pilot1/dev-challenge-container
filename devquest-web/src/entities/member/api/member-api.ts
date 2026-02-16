import { mainApi } from "@/shared/api/client";
import type { Member, MemberSaveRequest } from "../model";

export const membersApi = {
  findAll: () => mainApi.get<Member[]>("/members"),
  save: (data: MemberSaveRequest) =>
    mainApi.post<void>("/members/save", data),
};
