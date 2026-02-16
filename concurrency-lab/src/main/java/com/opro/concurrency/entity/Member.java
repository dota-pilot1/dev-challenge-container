package com.opro.concurrency.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Member {

    private Long id;
    private String email;

    @JsonIgnore
    private String password;

    private String nickname;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
