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
public class BrandSyncHistory {

    private Long id;
    private Long brandId;
    private String brandCode;
    private String syncType;       // REGISTER, UPDATE, DELETE
    private String syncStatus;     // PENDING, SUCCESS, FAILED
    private String requestPayload;
    private String responsePayload;
    private String errorMessage;
    private Integer retryCount;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}
