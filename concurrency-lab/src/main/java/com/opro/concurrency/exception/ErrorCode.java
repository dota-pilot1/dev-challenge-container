package com.opro.concurrency.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // Auth
    AUTH_REQUIRED(HttpStatus.UNAUTHORIZED, "AUTH_401", "인증이 필요합니다"),
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "AUTH_401_INVALID", "이메일 또는 비밀번호가 올바르지 않습니다"),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "AUTH_403", "접근 권한이 없습니다"),
    TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "AUTH_401_EXPIRED", "토큰이 만료되었습니다"),

    // User
    DUPLICATE_EMAIL(HttpStatus.CONFLICT, "USER_409", "이미 등록된 이메일입니다"),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "USER_404", "사용자를 찾을 수 없습니다"),

    // Common
    INVALID_REQUEST(HttpStatus.BAD_REQUEST, "COMMON_400", "잘못된 요청입니다"),
    SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON_500", "서버 오류가 발생했습니다");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
