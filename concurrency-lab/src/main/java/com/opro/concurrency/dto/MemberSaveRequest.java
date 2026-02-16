package com.opro.concurrency.dto;

import lombok.Data;

import java.util.List;

@Data
public class MemberSaveRequest {

    private List<MemberRow> rows;

    @Data
    public static class MemberRow {
        private Long id;
        private String email;
        private String nickname;
        private String status; // C: Create, U: Update, D: Delete
    }
}
