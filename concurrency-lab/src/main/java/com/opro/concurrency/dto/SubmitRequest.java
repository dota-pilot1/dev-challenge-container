package com.opro.concurrency.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SubmitRequest {

    @NotBlank(message = "제출 URL은 필수입니다")
    private String submissionUrl;
}
