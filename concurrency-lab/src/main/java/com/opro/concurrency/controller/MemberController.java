package com.opro.concurrency.controller;

import com.opro.concurrency.dto.MemberSaveRequest;
import com.opro.concurrency.entity.Member;
import com.opro.concurrency.service.MemberService;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping
    public ResponseEntity<List<Member>> findAll() {
        return ResponseEntity.ok(memberService.findAll());
    }

    @PostMapping("/save")
    public ResponseEntity<Map<String, String>> saveAll(
        @RequestBody MemberSaveRequest request
    ) {
        memberService.saveAll(request);
        return ResponseEntity.ok(Map.of("message", "저장되었습니다"));
    }
}
