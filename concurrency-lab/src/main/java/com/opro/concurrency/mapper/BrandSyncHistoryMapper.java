package com.opro.concurrency.mapper;

import com.opro.concurrency.entity.BrandSyncHistory;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface BrandSyncHistoryMapper {
    void insert(BrandSyncHistory history);

    void updateStatus(
        @Param("id") Long id,
        @Param("syncStatus") String syncStatus,
        @Param("responsePayload") String responsePayload,
        @Param("errorMessage") String errorMessage
    );

    void incrementRetryCount(@Param("id") Long id);

    List<BrandSyncHistory> findAll();

    List<BrandSyncHistory> findByBrandId(@Param("brandId") Long brandId);

    List<BrandSyncHistory> findByStatus(@Param("syncStatus") String syncStatus);
}
