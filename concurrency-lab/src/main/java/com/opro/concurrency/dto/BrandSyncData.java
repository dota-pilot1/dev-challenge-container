package com.opro.concurrency.dto;

import com.opro.concurrency.entity.Brand;
import lombok.Builder;
import lombok.Data;

/**
 * 외부 서버(shop-api)에 보내는 브랜드 동기화 데이터
 */
@Data
@Builder
public class BrandSyncData {

    private String brandCode;
    private String shopId;
    private String brandMid;
    private String brandNameKo;
    private String brandNameEn;
    private String brandDesc;
    private String useYn;

    public static BrandSyncData from(Brand brand) {
        return BrandSyncData.builder()
            .brandCode(brand.getBrandCode())
            .shopId(brand.getShopId())
            .brandMid(brand.getSteId())
            .brandNameKo(brand.getBrandNameKo())
            .brandNameEn(brand.getBrandNameEn())
            .brandDesc(brand.getBrandDesc())
            .useYn(brand.getUseYn())
            .build();
    }
}
