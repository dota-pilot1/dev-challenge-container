package com.opro.concurrency.entity;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Participation {

    private Long id;
    private Long challengeId;
    private Long userId;
    private String status; // APPLIED, SUBMITTED, APPROVED, REJECTED
    private String submissionUrl;
    private LocalDateTime submittedAt;
    private Integer orderId; // shop-api 주문 ID (승인 시 저장)
    private String nickname; // member JOIN 결과 (DB 컬럼 아님)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
