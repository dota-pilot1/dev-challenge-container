CREATE TABLE participation (
    id                 BIGSERIAL    PRIMARY KEY,
    challenge_id       BIGINT       NOT NULL REFERENCES challenge(id),
    user_id            BIGINT       NOT NULL,
    status             VARCHAR(20)  NOT NULL DEFAULT 'APPLIED',
    submission_url     VARCHAR(500),
    submitted_at       TIMESTAMP,
    order_id           INTEGER,
    created_at         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (challenge_id, user_id)
);
