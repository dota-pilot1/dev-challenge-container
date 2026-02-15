package com.opro.concurrency.service;

import com.opro.concurrency.client.ShopClient;
import com.opro.concurrency.dto.CreateParticipationRequest;
import com.opro.concurrency.dto.SubmitRequest;
import com.opro.concurrency.entity.ApprovalHistory;
import com.opro.concurrency.entity.Challenge;
import com.opro.concurrency.entity.Participation;
import com.opro.concurrency.exception.CustomException;
import com.opro.concurrency.exception.ErrorCode;
import com.opro.concurrency.mapper.ApprovalHistoryMapper;
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
    private final ApprovalHistoryMapper approvalHistoryMapper;
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
        // 비관적 락: 동시 승인 요청 시 하나만 통과하도록 행 잠금
        Participation participation = participationMapper
            .findByIdForUpdate(id)
            .orElseThrow(() ->
                new CustomException(
                    ErrorCode.INVALID_REQUEST,
                    "참가 정보를 찾을 수 없습니다"
                )
            );

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

        // 닉네임 조회 (findByIdForUpdate는 JOIN 없이 행잠금만 수행)
        Participation withNickname = findById(id);
        String nickname = withNickname.getNickname();

        // shop-api에 주문 요청 (멱등성 키: 참가 ID 기반)
        String idempotencyKey = "participation-" + id;
        try {
            Map<String, Object> order = shopClient.createOrder(
                challenge.getRewardProductId(),
                participation.getUserId(),
                challenge.getRewardQuantity(),
                idempotencyKey,
                nickname
            );

            Integer orderId = ((Number) order.get("id")).intValue();
            participationMapper.updateOrderId(id, orderId);
            participationMapper.updateStatus(id, "APPROVED");

            // 이력: 성공 기록
            approvalHistoryMapper.insert(
                ApprovalHistory.builder()
                    .participationId(id)
                    .action("APPROVE_REQUEST")
                    .status("SUCCESS")
                    .orderId(orderId)
                    .build()
            );
        } catch (Exception e) {
            log.error(
                "shop-api 주문 실패: participationId={}, error={}",
                id,
                e.getMessage()
            );
            participationMapper.updateStatus(id, "APPROVE_FAILED");

            // 이력: 실패 기록
            approvalHistoryMapper.insert(
                ApprovalHistory.builder()
                    .participationId(id)
                    .action("APPROVE_REQUEST")
                    .status("FAILED")
                    .errorMessage(e.getMessage())
                    .build()
            );
        }

        return findById(id);
    }

    @Transactional
    public Participation retryApprove(Long id) {
        Participation participation = participationMapper
            .findByIdForUpdate(id)
            .orElseThrow(() ->
                new CustomException(
                    ErrorCode.INVALID_REQUEST,
                    "참가 정보를 찾을 수 없습니다"
                )
            );

        if (!"APPROVE_FAILED".equals(participation.getStatus())) {
            throw new CustomException(
                ErrorCode.INVALID_REQUEST,
                "승인 실패 상태에서만 재시도할 수 있습니다"
            );
        }

        Challenge challenge = challengeService.findById(
            participation.getChallengeId()
        );

        // 닉네임 조회
        Participation withNickname = findById(id);
        String nickname = withNickname.getNickname();

        // 동일한 멱등성 키 사용 (이전 요청이 성공했으면 기존 주문 반환)
        String idempotencyKey = "participation-" + id;
        try {
            Map<String, Object> order = shopClient.createOrder(
                challenge.getRewardProductId(),
                participation.getUserId(),
                challenge.getRewardQuantity(),
                idempotencyKey,
                nickname
            );

            Integer orderId = ((Number) order.get("id")).intValue();
            participationMapper.updateOrderId(id, orderId);
            participationMapper.updateStatus(id, "APPROVED");

            approvalHistoryMapper.insert(
                ApprovalHistory.builder()
                    .participationId(id)
                    .action("APPROVE_RETRY")
                    .status("SUCCESS")
                    .orderId(orderId)
                    .build()
            );
        } catch (Exception e) {
            log.error(
                "shop-api 주문 재시도 실패: participationId={}, error={}",
                id,
                e.getMessage()
            );

            approvalHistoryMapper.insert(
                ApprovalHistory.builder()
                    .participationId(id)
                    .action("APPROVE_RETRY")
                    .status("FAILED")
                    .errorMessage(e.getMessage())
                    .build()
            );
        }

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
