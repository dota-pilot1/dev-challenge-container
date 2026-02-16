-- 플랫폼 브랜드 마스터
CREATE TABLE platform_brand (
    id              BIGSERIAL PRIMARY KEY,
    brand_code      VARCHAR(50) NOT NULL UNIQUE,
    brand_name_ko   VARCHAR(200) NOT NULL,
    brand_name_en   VARCHAR(200),
    brand_name_jp   VARCHAR(200),
    brand_name_zh_cn VARCHAR(200),
    brand_name_zh_tw VARCHAR(200),
    category_code   VARCHAR(50),
    use_yn          VARCHAR(1) DEFAULT 'Y',
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- 입점사 브랜드 (핵심 관리 대상)
CREATE TABLE brand (
    id              BIGSERIAL PRIMARY KEY,
    brand_code      VARCHAR(50) NOT NULL,
    shop_id         VARCHAR(50) NOT NULL,
    ste_id          VARCHAR(50) NOT NULL,
    brand_name_ko   VARCHAR(200) NOT NULL,
    brand_name_en   VARCHAR(200),
    brand_name_jp   VARCHAR(200),
    brand_name_zh_cn VARCHAR(200),
    brand_name_zh_tw VARCHAR(200),
    brand_desc      TEXT,
    use_yn          VARCHAR(1) DEFAULT 'Y',
    sync_status     VARCHAR(20) DEFAULT 'NONE',
    sync_retry_count INT DEFAULT 0,
    last_sync_at    TIMESTAMP,
    last_sync_error TEXT,
    reg_id          VARCHAR(50),
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW(),
    version         INTEGER DEFAULT 0,
    UNIQUE (brand_code, shop_id, ste_id)
);
