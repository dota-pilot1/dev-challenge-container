package com.opro.concurrency.service;

import com.opro.concurrency.client.ShopClient;
import com.opro.concurrency.dto.CreateParticipationRequest;
import com.opro.concurrency.dto.SubmitRequest;
import com.opro.concurrency.entity.Challenge;
import com.opro.concurrency.entity.Participation;
import com.opro.concurrency.exception.CustomException;
import com.opro.concurrency.exception.ErrorCode;
import com.opro.concurrency.mapper.ParticipationMapper;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ParticipationService {

    private final ParticipationMapper participationMapper;
    private final ChallengeService challengeService;
    private final ShopClient shopClient;

    @Transactional
    public Participation apply(CreateParticipationRequest request) {
        // 챌린지 존재 확인
        challengeService.findById(request.getChallengeId());

        Participation participation = Participation.builder()
            .challengeId(request.getChallengeId())
            .userId(request.getUserId())
            .status("APPLIED")
            .build();

        participationMapper.insert(participation);
        return participation;
    }

    @Transactional
    public Participation submit(Long id, SubmitRequest request) {
        Participation participation = findById(id);

        if (!"APPLIED".equals(participation.getStatus())) {
            throw new CustomException(
                ErrorCode.INVALID_REQUEST,
                "참가 신청 상태에서만 제출할 수 있습니다"
            );
        }

        participationMapper.updateSubmission(id, request.getSubmissionUrl());
        return findById(id);
    }

    @Transactional
    public Participation approve(Long id) {
        Participation participation = findById(id);

        if (!"SUBMITTED".equals(participation.getStatus())) {
            throw new CustomException(
                ErrorCode.INVALID_REQUEST,
                "제출 완료 상태에서만 승인할 수 있습니다"
            );
        }

        // 챌린지의 보상 상품 조회
        Challenge challenge = challengeService.findById(
            participation.getChallengeId()
        );

        // shop-api에 주문 요청 (서버간 통신 - 정합성 문제 발생 지점!)
        try {
            Map<String, Object> order = shopClient.createOrder(
                challenge.getRewardProductId(),
                participation.getUserId(),
                1
            );

            // 주문 ID 저장
            Integer orderId = ((Number) order.get("id")).intValue();
            participationMapper.updateOrderId(id, orderId);
        } catch (Exception e) {
            log.error(
                "shop-api 주문 실패: participationId={}, error={}",
                id,
                e.getMessage()
            );
            participationMapper.updateStatus(id, "APPROVED");
            // 주문은 실패했지만 승인은 처리 → 정합성 불일치 (2단계에서 해결)
            return findById(id);
        }

        participationMapper.updateStatus(id, "APPROVED");
        return findById(id);
    }

    @Transactional
    public Participation reject(Long id) {
        Participation participation = findById(id);

        if (!"SUBMITTED".equals(participation.getStatus())) {
            throw new CustomException(
                ErrorCode.INVALID_REQUEST,
                "제출 완료 상태에서만 반려할 수 있습니다"
            );
        }

        participationMapper.updateStatus(id, "REJECTED");
        return findById(id);
    }

    public Participation findById(Long id) {
        return participationMapper
            .findById(id)
            .orElseThrow(() ->
                new CustomException(
                    ErrorCode.INVALID_REQUEST,
                    "참가 정보를 찾을 수 없습니다"
                )
            );
    }

    public List<Participation> findByChallengeId(Long challengeId) {
        return participationMapper.findByChallengeId(challengeId);
    }

    public List<Participation> findAll() {
        return participationMapper.findAll();
    }

    @Transactional
    public void cancel(Long id) {
        Participation participation = findById(id);

        if (!"APPLIED".equals(participation.getStatus())) {
            throw new CustomException(
                ErrorCode.INVALID_REQUEST,
                "참가 신청 상태에서만 취소할 수 있습니다"
            );
        }

        participationMapper.deleteById(id);
    }
}
