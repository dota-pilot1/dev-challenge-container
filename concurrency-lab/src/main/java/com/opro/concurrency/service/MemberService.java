package com.opro.concurrency.service;

import com.opro.concurrency.dto.MemberSaveRequest;
import com.opro.concurrency.entity.Member;
import com.opro.concurrency.exception.CustomException;
import com.opro.concurrency.exception.ErrorCode;
import com.opro.concurrency.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberMapper memberMapper;

    public List<Member> findAll() {
        return memberMapper.findAll();
    }

    @Transactional
    public void saveAll(MemberSaveRequest request) {
        for (MemberSaveRequest.MemberRow row : request.getRows()) {
            switch (row.getStatus()) {
                case "C" -> {
                    if (memberMapper.existsByEmail(row.getEmail())) {
                        throw new CustomException(ErrorCode.DUPLICATE_EMAIL);
                    }
                    Member member = Member.builder()
                            .email(row.getEmail())
                            .password("$2a$10$default") // 기본 비밀번호 (관리자 생성)
                            .nickname(row.getNickname())
                            .build();
                    memberMapper.insert(member);
                }
                case "U" -> {
                    Member member = memberMapper.findById(row.getId())
                            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
                    member.setNickname(row.getNickname());
                    memberMapper.update(member);
                }
                case "D" -> {
                    memberMapper.findById(row.getId())
                            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
                    memberMapper.deleteById(row.getId());
                }
            }
        }
    }
}
