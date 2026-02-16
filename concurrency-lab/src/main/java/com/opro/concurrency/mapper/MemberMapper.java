package com.opro.concurrency.mapper;

import com.opro.concurrency.entity.Member;
import java.util.List;
import java.util.Optional;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MemberMapper {
    void insert(Member member);

    Optional<Member> findByEmail(@Param("email") String email);

    boolean existsByEmail(@Param("email") String email);

    List<Member> findAll();

    Optional<Member> findById(@Param("id") Long id);

    void update(Member member);

    void deleteById(@Param("id") Long id);
}
