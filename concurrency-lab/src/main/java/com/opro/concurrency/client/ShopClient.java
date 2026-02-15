package com.opro.concurrency.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Slf4j
@Component
public class ShopClient {

    private final RestClient restClient;

    public ShopClient(@Value("${shop.api.url:http://localhost:3000/api}") String baseUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    /**
     * shop-api에 주문 요청
     * @return 생성된 주문 정보 (Map)
     */
    public Map<String, Object> createOrder(int productId, long userId, int quantity) {
        log.info("shop-api 주문 요청: productId={}, userId={}, quantity={}", productId, userId, quantity);

        @SuppressWarnings("unchecked")
        Map<String, Object> response = restClient.post()
                .uri("/orders")
                .header("Content-Type", "application/json")
                .body(Map.of(
                        "productId", productId,
                        "userId", userId,
                        "quantity", quantity
                ))
                .retrieve()
                .body(Map.class);

        log.info("shop-api 주문 완료: {}", response);
        return response;
    }
}
