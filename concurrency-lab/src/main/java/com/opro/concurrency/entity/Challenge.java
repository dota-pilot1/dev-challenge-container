package com.opro.concurrency.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Challenge {
    private Long id;
    private String title;
    private String description;
    private Integer rewardProductId;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
