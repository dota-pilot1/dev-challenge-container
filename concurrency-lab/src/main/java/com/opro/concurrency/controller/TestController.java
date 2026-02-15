package com.opro.concurrency.controller;

import com.opro.concurrency.security.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/protected")
    public ResponseEntity<Map<String, Object>> protectedEndpoint(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(Map.of(
                "message", "인증된 사용자만 접근 가능합니다",
                "email", userDetails.getUsername(),
                "memberId", userDetails.getMemberId()
        ));
    }
}
