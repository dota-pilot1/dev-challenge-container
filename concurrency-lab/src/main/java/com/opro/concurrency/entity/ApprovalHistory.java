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
public class ApprovalHistory {

    private Long id;
    private Long participationId;
    private String action;        // APPROVE_REQUEST, APPROVE_RETRY, APPROVE_CANCEL
    private String status;        // SUCCESS, FAILED
    private Integer orderId;
    private String errorMessage;
    private LocalDateTime createdAt;
}
