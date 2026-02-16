package com.opro.concurrency.service;

import com.opro.concurrency.entity.PlatformBrand;
import com.opro.concurrency.mapper.PlatformBrandMapper;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlatformBrandService {

    private final PlatformBrandMapper platformBrandMapper;

    public List<PlatformBrand> findAll() {
        return platformBrandMapper.findAll();
    }
}
