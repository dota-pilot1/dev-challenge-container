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
public class Brand {

    private Long id;
    private String brandCode;
    private String shopId;
    private String steId;
    private String brandNameKo;
    private String brandNameEn;
    private String brandNameJp;
    private String brandNameZhCn;
    private String brandNameZhTw;
    private String brandDesc;
    private String useYn;
    private String syncStatus;
    private Integer syncRetryCount;
    private LocalDateTime lastSyncAt;
    private String lastSyncError;
    private String regId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer version;
}
