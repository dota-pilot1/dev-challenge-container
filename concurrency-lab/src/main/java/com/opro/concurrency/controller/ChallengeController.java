package com.opro.concurrency.controller;

import com.opro.concurrency.dto.CreateChallengeRequest;
import com.opro.concurrency.entity.Challenge;
import com.opro.concurrency.service.ChallengeService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/challenges")
@RequiredArgsConstructor
public class ChallengeController {

    private final ChallengeService challengeService;

    @PostMapping
    public ResponseEntity<Challenge> create(
        @Valid @RequestBody CreateChallengeRequest request
    ) {
        Challenge challenge = challengeService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(challenge);
    }

    @GetMapping
    public ResponseEntity<List<Challenge>> findAll() {
        return ResponseEntity.ok(challengeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Challenge> findById(@PathVariable Long id) {
        return ResponseEntity.ok(challengeService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Challenge> update(
        @PathVariable Long id,
        @Valid @RequestBody CreateChallengeRequest request
    ) {
        return ResponseEntity.ok(challengeService.update(id, request));
    }
}
