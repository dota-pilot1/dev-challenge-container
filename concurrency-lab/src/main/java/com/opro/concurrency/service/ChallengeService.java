package com.opro.concurrency.service;

import com.opro.concurrency.dto.CreateChallengeRequest;
import com.opro.concurrency.entity.Challenge;
import com.opro.concurrency.exception.CustomException;
import com.opro.concurrency.exception.ErrorCode;
import com.opro.concurrency.mapper.ChallengeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChallengeService {

    private final ChallengeMapper challengeMapper;

    @Transactional
    public Challenge create(CreateChallengeRequest request) {
        Challenge challenge = Challenge.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .rewardProductId(request.getRewardProductId())
                .status("ACTIVE")
                .build();

        challengeMapper.insert(challenge);
        return challenge;
    }

    public List<Challenge> findAll() {
        return challengeMapper.findAll();
    }

    public Challenge findById(Long id) {
        return challengeMapper.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_REQUEST, "챌린지를 찾을 수 없습니다"));
    }
}
