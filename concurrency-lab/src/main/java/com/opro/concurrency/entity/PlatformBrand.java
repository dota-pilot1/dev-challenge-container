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
public class PlatformBrand {

    private Long id;
    private String brandCode;
    private String brandNameKo;
    private String brandNameEn;
    private String brandNameJp;
    private String brandNameZhCn;
    private String brandNameZhTw;
    private String categoryCode;
    private String useYn;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
