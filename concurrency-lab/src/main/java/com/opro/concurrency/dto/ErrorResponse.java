package com.opro.concurrency.dto;

import com.opro.concurrency.exception.ErrorCode;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ErrorResponse {
    private String code;
    private String message;
    private int status;
    private String path;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    public static ErrorResponse of(ErrorCode errorCode, String path) {
        return ErrorResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .status(errorCode.getStatus().value())
                .path(path)
                .build();
    }
}
