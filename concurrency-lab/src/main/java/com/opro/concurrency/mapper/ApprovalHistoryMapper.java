package com.opro.concurrency.mapper;

import com.opro.concurrency.entity.ApprovalHistory;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ApprovalHistoryMapper {
    void insert(ApprovalHistory history);

    List<ApprovalHistory> findAll();

    List<ApprovalHistory> findByParticipationId(
        @Param("participationId") Long participationId
    );
}
