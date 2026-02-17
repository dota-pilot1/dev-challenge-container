export interface Brand {
  id: number;
  brandCode: string;
  shopId: string;
  steId: string;
  brandNameKo: string;
  brandNameEn: string;
  brandNameJp: string;
  brandNameZhCn: string;
  brandNameZhTw: string;
  brandDesc: string;
  useYn: string;
  syncStatus: string;
  syncRetryCount: number;
  lastSyncAt: string;
  lastSyncError: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface PlatformBrand {
  id: number;
  brandCode: string;
  brandNameKo: string;
  brandNameEn: string;
  categoryCode: string;
  useYn: string;
}

export interface BrandRow {
  id?: number;
  brandCode: string;
  shopId: string;
  steId: string;
  brandNameKo: string;
  brandNameEn: string;
  brandDesc: string;
  useYn: string;
  version?: number;
  status: "C" | "U" | "D";
}

export interface BrandSaveRequest {
  rows: BrandRow[];
}

export interface BrandSyncHistory {
  id: number;
  brandId: number;
  brandCode: string;
  syncType: string;
  syncStatus: string;
  requestPayload: string | null;
  responsePayload: string | null;
  errorMessage: string | null;
  retryCount: number;
  createdAt: string;
  completedAt: string | null;
}
