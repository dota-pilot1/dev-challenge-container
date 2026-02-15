package com.opro.concurrency.controller;

import com.opro.concurrency.dto.CreateParticipationRequest;
import com.opro.concurrency.dto.SubmitRequest;
import com.opro.concurrency.entity.ApprovalHistory;
import com.opro.concurrency.entity.Participation;
import com.opro.concurrency.mapper.ApprovalHistoryMapper;
import com.opro.concurrency.service.ParticipationService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/participations")
@RequiredArgsConstructor
public class ParticipationController {

    private final ParticipationService participationService;
    private final ApprovalHistoryMapper approvalHistoryMapper;

    @PostMapping
    public ResponseEntity<Participation> apply(
        @Valid @RequestBody CreateParticipationRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
            participationService.apply(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<Participation>> findAll() {
        return ResponseEntity.ok(participationService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Participation> findById(@PathVariable Long id) {
        return ResponseEntity.ok(participationService.findById(id));
    }

    @GetMapping("/challenge/{challengeId}")
    public ResponseEntity<List<Participation>> findByChallengeId(
        @PathVariable Long challengeId
    ) {
        return ResponseEntity.ok(
            participationService.findByChallengeId(challengeId)
        );
    }

    @PatchMapping("/{id}/submit")
    public ResponseEntity<Participation> submit(
        @PathVariable Long id,
        @Valid @RequestBody SubmitRequest request
    ) {
        return ResponseEntity.ok(participationService.submit(id, request));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<Participation> approve(@PathVariable Long id) {
        return ResponseEntity.ok(participationService.approve(id));
    }

    @PatchMapping("/{id}/retry-approve")
    public ResponseEntity<Participation> retryApprove(@PathVariable Long id) {
        return ResponseEntity.ok(participationService.retryApprove(id));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<Participation> reject(@PathVariable Long id) {
        return ResponseEntity.ok(participationService.reject(id));
    }

    @GetMapping("/{id}/approval-history")
    public ResponseEntity<List<ApprovalHistory>> getApprovalHistory(
        @PathVariable Long id
    ) {
        return ResponseEntity.ok(
            approvalHistoryMapper.findByParticipationId(id)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancel(@PathVariable Long id) {
        participationService.cancel(id);
        return ResponseEntity.noContent().build();
    }
}
