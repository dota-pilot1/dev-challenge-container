package com.opro.concurrency.service;

import com.opro.concurrency.client.BrandSyncClient;
import com.opro.concurrency.dto.BrandSaveRequest;
import com.opro.concurrency.entity.Brand;
import com.opro.concurrency.exception.CustomException;
import com.opro.concurrency.exception.ErrorCode;
import com.opro.concurrency.mapper.BrandMapper;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BrandService {

    private final BrandMapper brandMapper;
    private final BrandSyncClient brandSyncClient;

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
     * [문제 재현용] 실무 코드와 동일한 패턴
     * @Transactional 안에서 DB 저장 + 외부 API 호출을 같이 수행
     *
     * 문제점:
     * 1. 외부 API 성공 → 후속 처리 중 예외 → DB 롤백, 외부는 이미 반영됨
     * 2. DB 저장 후 외부 API 타임아웃 → 트랜잭션 장시간 점유 (커넥션 낭비)
     * 3. 동시 요청 시 같은 brandCode에 대해 경합 발생
     */
    @Transactional
    public void saveAndSync(BrandSaveRequest request) {
        List<Map<String, Object>> syncList = new ArrayList<>();
        List<Long> savedBrandIds = new ArrayList<>();

        // 1단계: DB 저장 (실무 코드의 for 루프와 동일)
        for (BrandSaveRequest.BrandRow row : request.getRows()) {
            log.info(
                "saveAndSync row: status={}, id={}, brandCode={}, brandNameKo={}",
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
                        .build();
                    brandMapper.insert(brand);
                    savedBrandIds.add(brand.getId());

                    Map<String, Object> syncData = new HashMap<>();
                    syncData.put("brandCode", row.getBrandCode());
                    syncData.put("shopId", row.getShopId());
                    syncData.put("brandMid", row.getSteId());
                    syncData.put("brandNameKo", row.getBrandNameKo());
                    syncData.put("brandNameEn", row.getBrandNameEn());
                    syncData.put("brandDesc", row.getBrandDesc());
                    syncData.put("useYn", row.getUseYn());
                    syncList.add(syncData);
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
                    savedBrandIds.add(brand.getId());

                    Map<String, Object> syncData = new HashMap<>();
                    syncData.put("brandCode", row.getBrandCode());
                    syncData.put("shopId", row.getShopId());
                    syncData.put("brandMid", row.getSteId());
                    syncData.put("brandNameKo", row.getBrandNameKo());
                    syncData.put("brandNameEn", row.getBrandNameEn());
                    syncData.put("brandDesc", row.getBrandDesc());
                    syncData.put("useYn", row.getUseYn());
                    syncList.add(syncData);
                }
                default -> log.warn("알 수 없는 status: {}", row.getStatus());
            }
        }

        // 2단계: 같은 트랜잭션 안에서 외부 API 호출 (문제의 핵심!)
        if (!syncList.isEmpty()) {
            log.info("외부 플랫폼 동기화 요청: {}건", syncList.size());
            brandSyncClient.registerBrands(syncList);
            log.info("외부 플랫폼 동기화 완료");

            // 동기화 성공 시 syncStatus 업데이트
            for (Long brandId : savedBrandIds) {
                brandMapper.updateSyncStatus(brandId, "SUCCESS", null);
            }
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
