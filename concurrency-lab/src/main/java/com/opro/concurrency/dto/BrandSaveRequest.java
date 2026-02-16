package com.opro.concurrency.dto;

import java.util.List;
import lombok.Data;

@Data
public class BrandSaveRequest {

    private List<BrandRow> rows;

    @Data
    public static class BrandRow {
        private Long id;
        private String brandCode;
        private String shopId;
        private String steId;
        private String brandNameKo;
        private String brandNameEn;
        private String brandNameJp;
        private String brandNameZhCn;
        private String brandNameZhTw;
        private String brandDesc;
        private String useYn;
        private Integer version;
        private String status; // C: Create, U: Update, D: Delete
    }
}
