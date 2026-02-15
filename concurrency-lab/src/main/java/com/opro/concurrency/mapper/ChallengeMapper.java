package com.opro.concurrency.mapper;

import com.opro.concurrency.entity.Challenge;
import java.util.List;
import java.util.Optional;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ChallengeMapper {
    void insert(Challenge challenge);

    List<Challenge> findAll();

    Optional<Challenge> findById(@Param("id") Long id);

    void update(Challenge challenge);
}
