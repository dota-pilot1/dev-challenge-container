-- 외부 API 동기화 이력 테이블
CREATE TABLE brand_sync_history (
    id                BIGSERIAL PRIMARY KEY,
    brand_id          BIGINT NOT NULL,
    brand_code        VARCHAR(50) NOT NULL,
    sync_type         VARCHAR(20) NOT NULL,
    sync_status       VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    request_payload   TEXT,
    response_payload  TEXT,
    error_message     TEXT,
    retry_count       INT DEFAULT 0,
    created_at        TIMESTAMP DEFAULT NOW(),
    completed_at      TIMESTAMP,

    CONSTRAINT fk_brand_sync_history_brand
        FOREIGN KEY (brand_id) REFERENCES brand(id) ON DELETE CASCADE
);

CREATE INDEX idx_bsh_brand_id ON brand_sync_history(brand_id);
CREATE INDEX idx_bsh_status ON brand_sync_history(sync_status);
CREATE INDEX idx_bsh_created ON brand_sync_history(created_at);
