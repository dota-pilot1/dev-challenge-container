package com.opro.concurrency.mapper;

import com.opro.concurrency.entity.PlatformBrand;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PlatformBrandMapper {

    void upsert(PlatformBrand platformBrand);

    List<PlatformBrand> findAll();
}
