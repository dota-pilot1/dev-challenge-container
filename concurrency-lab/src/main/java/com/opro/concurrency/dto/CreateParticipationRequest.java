package com.opro.concurrency.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateParticipationRequest {

    @NotNull(message = "챌린지 ID는 필수입니다")
    private Long challengeId;

    @NotNull(message = "사용자 ID는 필수입니다")
    private Long userId;
}
