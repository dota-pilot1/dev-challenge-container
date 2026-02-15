CREATE TABLE challenge (
    id                 BIGSERIAL    PRIMARY KEY,
    title              VARCHAR(255) NOT NULL,
    description        TEXT,
    reward_product_id  INTEGER      NOT NULL,
    status             VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    created_at         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);
