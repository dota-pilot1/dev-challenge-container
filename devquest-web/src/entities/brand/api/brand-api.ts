import { mainApi, paymentApi } from "@/shared/api/client";
import type { Brand, PlatformBrand, BrandSaveRequest } from "../model";

export const brandsApi = {
  findAll: () => mainApi.get<Brand[]>("/brands"),
  findById: (id: number) => mainApi.get<Brand>(`/brands/${id}`),
  findBySyncStatus: (status: string) =>
    mainApi.get<Brand[]>(`/brands/sync-status/${status}`),
  delete: (id: number) => mainApi.delete(`/brands/${id}`),
  deleteAll: () => mainApi.delete("/brands/all"),
  save: (data: BrandSaveRequest) => mainApi.post<void>("/brands/save", data),
  saveAndSync: (data: BrandSaveRequest) =>
    mainApi.post<void>("/brands/save-and-sync", data),
};

export const platformBrandsApi = {
  findAll: () => mainApi.get<PlatformBrand[]>("/platform-brands"),
};

export interface ExternalBrand {
  id: number;
  brandCode: string;
  shopId: string | null;
  brandMid: string;
  brandNameKo: string;
  brandNameEn: string | null;
  brandDesc: string | null;
  useYn: string;
  createdAt: string;
  updatedAt: string;
}

export const externalBrandsApi = {
  findAll: () => paymentApi.get<ExternalBrand[]>("/brands"),
  deleteAll: () => paymentApi.delete("/brands/all"),
};
