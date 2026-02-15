package com.opro.concurrency.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateChallengeRequest {

    @NotBlank(message = "챌린지 제목은 필수입니다")
    private String title;

    private String description;

    @NotNull(message = "보상 상품 ID는 필수입니다")
    private Integer rewardProductId;
}
