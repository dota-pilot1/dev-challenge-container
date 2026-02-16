package com.opro.concurrency.mapper;

import com.opro.concurrency.entity.Brand;
import java.util.List;
import java.util.Optional;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface BrandMapper {
    void insert(Brand brand);

    void update(Brand brand);

    int updateWithVersion(Brand brand);

    void deleteById(@Param("id") Long id);

    void deleteAll();

    List<Brand> findAll();

    Optional<Brand> findById(@Param("id") Long id);

    Optional<Brand> findByIdForUpdate(@Param("id") Long id);

    void updateSyncStatus(
        @Param("id") Long id,
        @Param("syncStatus") String syncStatus,
        @Param("lastSyncError") String lastSyncError
    );

    void incrementSyncRetryCount(@Param("id") Long id);

    List<Brand> findBySyncStatus(@Param("syncStatus") String syncStatus);
}
