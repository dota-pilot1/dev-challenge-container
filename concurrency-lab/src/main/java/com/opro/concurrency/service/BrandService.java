package com.opro.concurrency.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.opro.concurrency.client.BrandSyncClient;
import com.opro.concurrency.dto.BrandSaveRequest;
import com.opro.concurrency.dto.BrandSyncData;
import com.opro.concurrency.entity.Brand;
import com.opro.concurrency.entity.BrandSyncHistory;
import com.opro.concurrency.exception.CustomException;
import com.opro.concurrency.exception.ErrorCode;
import com.opro.concurrency.mapper.BrandMapper;
import com.opro.concurrency.mapper.BrandSyncHistoryMapper;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BrandService {

    /** DB 저장 결과를 syncToExternal에 넘기기 위한 DTO */
    public record SavedBrand(Brand brand, String syncType) {}

    private final BrandMapper brandMapper;
    private final BrandSyncHistoryMapper brandSyncHistoryMapper;
    private final BrandSyncClient brandSyncClient;
    private final ObjectMapper objectMapper;

    public List<Brand> findAll() {
        return brandMapper.findAll();
    }

    public Brand findById(Long id) {
        return brandMapper
            .findById(id)
            .orElseThrow(() -> new CustomException(ErrorCode.BRAND_NOT_FOUND));
    }

    public List<Brand> findBySyncStatus(String syncStatus) {
        return brandMapper.findBySyncStatus(syncStatus);
    }

    @Transactional
    public void deleteAll() {
        brandMapper.deleteAll();
    }

    @Transactional
    public void delete(Long id) {
        Brand brand = brandMapper
            .findById(id)
            .orElseThrow(() -> new CustomException(ErrorCode.BRAND_NOT_FOUND));
        brandMapper.deleteById(id);

        // 외부 서버에도 삭제 동기화
        brandSyncClient.deleteBrand(brand.getBrandCode());
    }

    /**
     * 통합 메서드 (트랜잭션 없음 — 각 단계가 자체 트랜잭션)
     *
     * [개선 전] @Transactional 안에서 DB 저장 + 외부 API 호출 → 커넥션 장시간 점유, 정합성 문제
     * [개선 후] DB 저장(TX#1) → 커밋 → 외부 API 호출(트랜잭션 없음) → 결과 업데이트(TX#2)
     */
    public void saveAndSync(BrandSaveRequest request) {
        // 1. DB 저장 (트랜잭션 #1 — 커밋 후 커넥션 반환)
        List<SavedBrand> savedBrands = saveBrands(request);

        // 2. 외부 API 호출 (트랜잭션 밖 — DB 커넥션 점유 안함)
        //    + 결과 업데이트 (트랜잭션 #2)
        if (!savedBrands.isEmpty()) {
            syncToExternal(savedBrands);
        }
    }

    /**
     * DB 저장만 수행 (INSERT/UPDATE + syncStatus=PENDING)
     * 트랜잭션 커밋 후 DB 커넥션 즉시 반환
     */
    @Transactional
    public List<SavedBrand> saveBrands(BrandSaveRequest request) {
        List<SavedBrand> savedBrands = new ArrayList<>();

        for (BrandSaveRequest.BrandRow row : request.getRows()) {
            log.info(
                "saveBrands row: status={}, id={}, brandCode={}, brandNameKo={}",
                row.getStatus(),
                row.getId(),
                row.getBrandCode(),
                row.getBrandNameKo()
            );
            switch (row.getStatus()) {
                case "C" -> {
                    Brand brand = Brand.builder()
                        .brandCode(row.getBrandCode())
                        .shopId(row.getShopId())
                        .steId(row.getSteId())
                        .brandNameKo(row.getBrandNameKo())
                        .brandNameEn(row.getBrandNameEn())
                        .brandDesc(row.getBrandDesc())
                        .useYn(row.getUseYn())
                        // 외부 api 요청 성공 여부
                        .syncStatus("PENDING")
                        .build();
                    // 디비에 저장
                    brandMapper.insert(brand);
                    // 외부 api 에 보낼 savedBrands 에 추가
                    savedBrands.add(new SavedBrand(brand, "REGISTER"));
                }
                case "U" -> {
                    Brand brand = brandMapper
                        .findById(row.getId())
                        .orElseThrow(() ->
                            new CustomException(ErrorCode.BRAND_NOT_FOUND)
                        );
                    brand.setBrandNameKo(row.getBrandNameKo());
                    brand.setBrandNameEn(row.getBrandNameEn());
                    brand.setBrandDesc(row.getBrandDesc());
                    brand.setUseYn(row.getUseYn());
                    brandMapper.update(brand);
                    brandMapper.updateSyncStatus(
                        brand.getId(),
                        "PENDING",
                        null // 이전 업데이트된 싱크 데이터는 건드리지 않음
                    );
                    savedBrands.add(new SavedBrand(brand, "UPDATE"));
                }
                default -> log.warn("알 수 없는 status: {}", row.getStatus());
            }
        }

        return savedBrands;
    }

    /**
     * 외부 API 호출 (트랜잭션 밖 — DB 커넥션 점유하지 않음)
     * 호출 전후로 brand_sync_history에 이력 기록
     */
    public void syncToExternal(List<SavedBrand> savedBrands) {
        // 외부 API에 보낼 데이터 목록
        List<BrandSyncData> syncList = new ArrayList<>();
        // 이력 테이블에 저장할 PENDING 이력 (성공/실패 시 업데이트용)
        List<BrandSyncHistory> histories = new ArrayList<>();
        // brand 테이블의 syncStatus 업데이트용 ID 목록
        List<Long> brandIds = new ArrayList<>();

        // 1. 동기화 데이터 준비 + 이력 PENDING 저장
        for (SavedBrand saved : savedBrands) {
            Brand brand = saved.brand();
            brandIds.add(brand.getId());
            BrandSyncData syncData = BrandSyncData.from(brand);
            // 외부 api 에 보낼 브랜드 데이터 리스트에 추가 하기
            syncList.add(syncData);
            BrandSyncHistory history = BrandSyncHistory.builder()
                .brandId(brand.getId())
                .brandCode(brand.getBrandCode())
                .syncType(saved.syncType())
                .syncStatus("PENDING")
                .requestPayload(toJson(syncData))
                .build();
            saveHistory(history);
            histories.add(history);
        }

        if (syncList.isEmpty()) return;

        // 2. 외부 API 호출 (DB 커넥션 점유 안함)
        try {
            log.info("외부 플랫폼 동기화 요청: {}건", syncList.size());
            // 외부 api 요청 날려서 브랜드 데이터 동기화
            String response = brandSyncClient.registerBrands(syncList);
            log.info("외부 플랫폼 동기화 완료");
            // brand_sync_history 테이블: PENDING → SUCCESS로 업데이트
            for (BrandSyncHistory history : histories) {
                completeHistory(history.getId(), "SUCCESS", response, null);
            }
            // brand 테이블: syncStatus를 SUCCESS로 업데이트
            updateSyncResults(brandIds, "SUCCESS", null);
        } catch (Exception e) {
            log.error("외부 동기화 실패: {}", e.getMessage());

            // 3-B. 실패: 이력 FAILED + brand syncStatus FAILED
            for (BrandSyncHistory history : histories) {
                completeHistory(
                    history.getId(),
                    "FAILED",
                    null,
                    e.getMessage()
                );
            }
            updateSyncResults(brandIds, "FAILED", e.getMessage());
        }
    }

    /**
     * 이력 저장 (별도 트랜잭션)
     */
    @Transactional
    public void saveHistory(BrandSyncHistory history) {
        brandSyncHistoryMapper.insert(history);
    }

    /**
     * 이력 상태 업데이트 (별도 트랜잭션)
     */
    @Transactional
    public void completeHistory(
        Long historyId,
        String status,
        String responsePayload,
        String errorMessage
    ) {
        brandSyncHistoryMapper.updateStatus(
            historyId,
            status,
            responsePayload,
            errorMessage
        );
    }

    /**
     * syncStatus 일괄 업데이트 (별도 트랜잭션)
     */
    @Transactional
    public void updateSyncResults(
        List<Long> brandIds,
        String status,
        String error
    ) {
        for (Long brandId : brandIds) {
            brandMapper.updateSyncStatus(brandId, status, error);
        }
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            log.warn("JSON 직렬화 실패: {}", e.getMessage());
            return null;
        }
    }

    @Transactional
    public void saveAll(BrandSaveRequest request) {
        for (BrandSaveRequest.BrandRow row : request.getRows()) {
            switch (row.getStatus()) {
                case "C" -> {
                    Brand brand = Brand.builder()
                        .brandCode(row.getBrandCode())
                        .shopId(row.getShopId())
                        .steId(row.getSteId())
                        .brandNameKo(row.getBrandNameKo())
                        .brandNameEn(row.getBrandNameEn())
                        .brandNameJp(row.getBrandNameJp())
                        .brandNameZhCn(row.getBrandNameZhCn())
                        .brandNameZhTw(row.getBrandNameZhTw())
                        .brandDesc(row.getBrandDesc())
                        .useYn(row.getUseYn())
                        .build();
                    brandMapper.insert(brand);
                }
                case "U" -> {
                    Brand brand = brandMapper
                        .findById(row.getId())
                        .orElseThrow(() ->
                            new CustomException(ErrorCode.BRAND_NOT_FOUND)
                        );

                    brand.setBrandNameKo(row.getBrandNameKo());
                    brand.setBrandNameEn(row.getBrandNameEn());
                    brand.setBrandNameJp(row.getBrandNameJp());
                    brand.setBrandNameZhCn(row.getBrandNameZhCn());
                    brand.setBrandNameZhTw(row.getBrandNameZhTw());
                    brand.setBrandDesc(row.getBrandDesc());
                    brand.setUseYn(row.getUseYn());

                    // 낙관적 락: version이 전달된 경우 version 체크
                    if (row.getVersion() != null) {
                        brand.setVersion(row.getVersion());
                        int updated = brandMapper.updateWithVersion(brand);
                        if (updated == 0) {
                            throw new CustomException(
                                ErrorCode.BRAND_VERSION_CONFLICT
                            );
                        }
                    } else {
                        brandMapper.update(brand);
                    }
                }
            }
        }
    }
}
