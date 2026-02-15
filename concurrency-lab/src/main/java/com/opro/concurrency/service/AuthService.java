package com.opro.concurrency.service;

import com.opro.concurrency.dto.AuthResponse;
import com.opro.concurrency.dto.LoginRequest;
import com.opro.concurrency.dto.SignupRequest;
import com.opro.concurrency.entity.Member;
import com.opro.concurrency.exception.CustomException;
import com.opro.concurrency.exception.ErrorCode;
import com.opro.concurrency.mapper.MemberMapper;
import com.opro.concurrency.security.CustomUserDetails;
import com.opro.concurrency.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final MemberMapper memberMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (memberMapper.existsByEmail(request.getEmail())) {
            throw new CustomException(ErrorCode.DUPLICATE_EMAIL);
        }

        Member member = Member.builder()
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .nickname(request.getNickname())
            .build();

        memberMapper.insert(member);

        String token = jwtUtil.generateToken(member.getEmail(), member.getId());

        return AuthResponse.builder()
            .token(token)
            .id(member.getId())
            .email(member.getEmail())
            .nickname(member.getNickname())
            .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        CustomUserDetails userDetails =
            (CustomUserDetails) authentication.getPrincipal();
        Member member = memberMapper
            .findByEmail(request.getEmail())
            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        String token = jwtUtil.generateToken(member.getEmail(), member.getId());

        return AuthResponse.builder()
            .token(token)
            .id(member.getId())
            .email(member.getEmail())
            .nickname(member.getNickname())
            .build();
    }
}
