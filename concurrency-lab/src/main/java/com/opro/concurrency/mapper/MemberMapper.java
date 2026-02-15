package com.opro.concurrency.mapper;

import com.opro.concurrency.entity.Member;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Optional;

@Mapper
public interface MemberMapper {

    void insert(Member member);

    Optional<Member> findByEmail(@Param("email") String email);

    boolean existsByEmail(@Param("email") String email);
}
