package com.opro.concurrency.client;

import com.opro.concurrency.dto.BrandSyncData;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Slf4j
@Component
public class BrandSyncClient {

    private final RestClient restClient;

    public BrandSyncClient(
        @Value("${shop.api.url:http://localhost:3000/api}") String baseUrl
    ) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    /**
     * shop-api(외부 플랫폼)에 브랜드 일괄 등록/수정 요청
     */
    public String registerBrands(List<BrandSyncData> brands) {
        log.info("shop-api 브랜드 동기화 요청: {}건", brands.size());

        String response = restClient
            .post()
            .uri("/brands/register-batch")
            .header("Content-Type", "application/json")
            .body(brands)
            .retrieve()
            .body(String.class);

        log.info("shop-api 브랜드 동기화 완료: {}건", brands.size());
        return response;
    }

    /**
     * shop-api(외부 플랫폼)에서 브랜드 삭제
     */
    public void deleteBrand(String brandCode) {
        log.info("shop-api 브랜드 삭제 요청: brandCode={}", brandCode);
        restClient
            .delete()
            .uri("/brands/{brandCode}", brandCode)
            .retrieve()
            .toBodilessEntity();
        log.info("shop-api 브랜드 삭제 완료: brandCode={}", brandCode);
    }
}
