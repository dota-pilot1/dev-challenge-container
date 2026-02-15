package com.opro.concurrency.client;

import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Slf4j
@Component
public class ShopClient {

    private final RestClient restClient;

    public ShopClient(
        @Value("${shop.api.url:http://localhost:3000/api}") String baseUrl
    ) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    /**
     * shop-api에 주문 요청
     * @return 생성된 주문 정보 (Map)
     */
    public Map<String, Object> createOrder(
        int productId,
        long userId,
        int quantity,
        String idempotencyKey,
        String nickname
    ) {
        log.info(
            "shop-api 주문 요청: productId={}, userId={}, quantity={}, idempotencyKey={}, nickname={}",
            productId,
            userId,
            quantity,
            idempotencyKey,
            nickname
        );

        @SuppressWarnings("unchecked")
        Map<String, Object> response = restClient
            .post()
            .uri("/orders")
            .header("Content-Type", "application/json")
            .body(
                Map.of(
                    "productId",
                    productId,
                    "userId",
                    userId,
                    "quantity",
                    quantity,
                    "idempotencyKey",
                    idempotencyKey,
                    "nickname",
                    nickname
                )
            )
            .retrieve()
            .body(Map.class);

        log.info("shop-api 주문 완료: {}", response);
        return response;
    }

    /**
     * shop-api에 주문 취소 요청 (보상 트랜잭션)
     * 주문 생성 후 후속 처리 실패 시 호출하여 주문을 취소하고 재고를 복구한다.
     */
    public void cancelOrder(int orderId) {
        log.info(
            "shop-api 주문 취소 요청 (보상 트랜잭션): orderId={}",
            orderId
        );

        restClient
            .patch()
            .uri("/orders/{id}/status", orderId)
            .header("Content-Type", "application/json")
            .body(Map.of("status", "CANCELLED"))
            .retrieve()
            .toBodilessEntity();

        log.info("shop-api 주문 취소 완료: orderId={}", orderId);
    }
}
