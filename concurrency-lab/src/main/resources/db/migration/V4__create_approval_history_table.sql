CREATE TABLE approval_history (
    id                 BIGSERIAL    PRIMARY KEY,
    participation_id   BIGINT       NOT NULL REFERENCES participation(id),
    action             VARCHAR(30)  NOT NULL,
    status             VARCHAR(20)  NOT NULL,
    order_id           INTEGER,
    error_message      TEXT,
    created_at         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);
