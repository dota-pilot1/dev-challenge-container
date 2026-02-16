package com.opro.concurrency.controller;

import com.opro.concurrency.dto.MemberSaveRequest;
import com.opro.concurrency.entity.Member;
import com.opro.concurrency.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<Void> saveAll(@RequestBody MemberSaveRequest request) {
        memberService.saveAll(request);
        return ResponseEntity.ok().build();
    }
}
