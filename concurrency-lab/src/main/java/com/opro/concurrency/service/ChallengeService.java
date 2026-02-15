package com.opro.concurrency.service;

import com.opro.concurrency.dto.CreateChallengeRequest;
import com.opro.concurrency.entity.Challenge;
import com.opro.concurrency.exception.CustomException;
import com.opro.concurrency.exception.ErrorCode;
import com.opro.concurrency.mapper.ChallengeMapper;
import com.opro.concurrency.mapper.ParticipationMapper;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ChallengeService {

    private final ChallengeMapper challengeMapper;
    private final ParticipationMapper participationMapper;

    @Transactional
    public Challenge create(CreateChallengeRequest request) {
        Challenge challenge = Challenge.builder()
            .title(request.getTitle())
            .description(request.getDescription())
            .rewardProductId(request.getRewardProductId())
            .rewardQuantity(request.getRewardQuantity())
            .status("ACTIVE")
            .build();

        challengeMapper.insert(challenge);
        return challenge;
    }

    public List<Challenge> findAll() {
        return challengeMapper.findAll();
    }

    public Challenge findById(Long id) {
        return challengeMapper
            .findById(id)
            .orElseThrow(() ->
                new CustomException(
                    ErrorCode.INVALID_REQUEST,
                    "챌린지를 찾을 수 없습니다"
                )
            );
    }

    @Transactional
    public Challenge update(Long id, CreateChallengeRequest request) {
        Challenge challenge = findById(id);

        int participantCount = participationMapper.countByChallengeId(id);
        if (participantCount > 0) {
            throw new CustomException(
                ErrorCode.INVALID_REQUEST,
                "참가자가 있는 챌린지는 수정할 수 없습니다"
            );
        }

        challenge.setTitle(request.getTitle());
        challenge.setDescription(request.getDescription());
        challenge.setRewardProductId(request.getRewardProductId());
        challenge.setRewardQuantity(request.getRewardQuantity());

        challengeMapper.update(challenge);
        return challenge;
    }
}
