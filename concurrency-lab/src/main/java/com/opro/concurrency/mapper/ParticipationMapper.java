package com.opro.concurrency.mapper;

import com.opro.concurrency.entity.Participation;
import java.util.List;
import java.util.Optional;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ParticipationMapper {
    void insert(Participation participation);

    Optional<Participation> findById(@Param("id") Long id);

    Optional<Participation> findByIdForUpdate(@Param("id") Long id);

    List<Participation> findByChallengeId(
        @Param("challengeId") Long challengeId
    );

    List<Participation> findAll();

    void updateStatus(@Param("id") Long id, @Param("status") String status);

    void updateSubmission(
        @Param("id") Long id,
        @Param("submissionUrl") String submissionUrl
    );

    void updateOrderId(@Param("id") Long id, @Param("orderId") Integer orderId);

    void deleteById(@Param("id") Long id);

    int countByChallengeId(@Param("challengeId") Long challengeId);
}
