package com.cj.freshway.fs.cps.airstar.common.enums;

import java.util.Arrays;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/*
 * Airstar 응답스키마의 응답코드 enum 
 * 
 * */

@Getter
@RequiredArgsConstructor
public enum AirstarResCodeEnum {
	SUCCESS("0200"),
    REGISTER_SUCCESS("0201"),
    ACCEPTED("0202"),

    BAD_REQUEST("0400"),
    UNAUTHORIZED("0401"),
    FORBIDDEN("0403"),
    NOT_FOUND("0404"),
    RESOURCE_NOT_FOUND("1404"),
    CONFLICT("0409"),

    DOMAIN_ERROR("6000"),
    UNKNOWN_ERROR("9999");

    private final String code;

    public static AirstarResCodeEnum from(String code) {
        return Arrays.stream(values())
                .filter(v -> v.code.equals(code))
                .findFirst()
                .orElse(UNKNOWN_ERROR);
    }

    public boolean isSuccess() {
        return this == SUCCESS
            || this == REGISTER_SUCCESS
            || this == ACCEPTED;
    }
}
