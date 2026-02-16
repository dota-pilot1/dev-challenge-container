package com.opro.concurrency.controller;

import com.opro.concurrency.entity.PlatformBrand;
import com.opro.concurrency.service.PlatformBrandService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/platform-brands")
@RequiredArgsConstructor
public class PlatformBrandController {

    private final PlatformBrandService platformBrandService;

    @GetMapping
    public ResponseEntity<List<PlatformBrand>> findAll() {
        return ResponseEntity.ok(platformBrandService.findAll());
    }
}
