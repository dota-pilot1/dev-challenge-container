package com.opro.concurrency.controller;

import com.opro.concurrency.dto.BrandSaveRequest;
import com.opro.concurrency.entity.Brand;
import com.opro.concurrency.entity.BrandSyncHistory;
import com.opro.concurrency.mapper.BrandSyncHistoryMapper;
import com.opro.concurrency.service.BrandService;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/brands")
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;
    private final BrandSyncHistoryMapper brandSyncHistoryMapper;

    @GetMapping
    public ResponseEntity<List<Brand>> findAll() {
        return ResponseEntity.ok(brandService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Brand> findById(@PathVariable Long id) {
        return ResponseEntity.ok(brandService.findById(id));
    }

    @GetMapping("/sync-status/{status}")
    public ResponseEntity<List<Brand>> findBySyncStatus(
        @PathVariable String status
    ) {
        return ResponseEntity.ok(brandService.findBySyncStatus(status));
    }

    @GetMapping("/sync-history")
    public ResponseEntity<List<BrandSyncHistory>> findSyncHistory() {
        return ResponseEntity.ok(brandSyncHistoryMapper.findAll());
    }

    @DeleteMapping("/all")
    public ResponseEntity<Map<String, String>> deleteAll() {
        brandService.deleteAll();
        return ResponseEntity.ok(Map.of("message", "전체 삭제되었습니다"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        brandService.delete(id);
        return ResponseEntity.ok(Map.of("message", "삭제되었습니다"));
    }

    @PostMapping("/save")
    public ResponseEntity<Map<String, String>> saveAll(
        @RequestBody BrandSaveRequest request
    ) {
        brandService.saveAll(request);
        return ResponseEntity.ok(Map.of("message", "저장되었습니다"));
    }

    /**
     * [문제 재현용] DB 저장 + 외부 API 동기화를 같은 트랜잭션에서 수행
     * 실무 코드의 savePartenrBrands()와 동일한 패턴
     */
    @PostMapping("/save-and-sync")
    public ResponseEntity<Map<String, String>> saveAndSync(
        @RequestBody BrandSaveRequest request
    ) {
        brandService.saveAndSync(request);
        return ResponseEntity.ok(Map.of("message", "저장 및 외부 연동 완료"));
    }
}
