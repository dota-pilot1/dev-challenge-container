package com.opro.concurrency.controller;

import com.opro.concurrency.entity.ApprovalHistory;
import com.opro.concurrency.mapper.ApprovalHistoryMapper;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/approval-history")
@RequiredArgsConstructor
public class ApprovalHistoryController {

    private final ApprovalHistoryMapper approvalHistoryMapper;

    @GetMapping
    public ResponseEntity<List<ApprovalHistory>> findAll() {
        return ResponseEntity.ok(approvalHistoryMapper.findAll());
    }
}
