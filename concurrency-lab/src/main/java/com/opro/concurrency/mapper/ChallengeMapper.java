package com.opro.concurrency.mapper;

import com.opro.concurrency.entity.Challenge;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface ChallengeMapper {

    void insert(Challenge challenge);

    List<Challenge> findAll();

    Optional<Challenge> findById(@Param("id") Long id);
}
