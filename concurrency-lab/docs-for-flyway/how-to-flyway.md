# Flyway 사용 가이드

## Flyway란?

데이터베이스 스키마를 **버전 관리**하는 마이그레이션 도구.
앱 시작 시 아직 적용 안 된 SQL을 자동으로 실행한다.

```
앱 시작 → Flyway가 flyway_schema_history 테이블 확인 → 새 SQL 발견 → 자동 실행
```

## 파일 명명 규칙

```
V{버전}__{설명}.sql
```

- `V` : 접두사 (필수)
- `{버전}` : 숫자 (1, 2, 3 ... 또는 1.1, 1.2)
- `__` : 언더스코어 **두 개** (필수)
- `{설명}` : 설명 (공백 대신 언더스코어)

### 예시

```
V1__create_member_table.sql       # 회원 테이블 생성
V2__add_phone_column.sql          # 전화번호 컬럼 추가
V3__create_product_table.sql      # 상품 테이블 생성
```

## 디렉토리 위치

```
src/main/resources/db/migration/
├── V1__create_member_table.sql
├── V2__add_phone_column.sql
└── ...
```

## 설정 (application.properties)

```properties
spring.flyway.enabled=true                       # Flyway 활성화
spring.flyway.baseline-on-migrate=true           # 기존 DB에도 적용 가능
spring.flyway.locations=classpath:db/migration   # SQL 파일 위치
```

## 사용법

### 1. SQL 파일 추가

`src/main/resources/db/migration/V2__add_phone_column.sql`:

```sql
ALTER TABLE member ADD COLUMN phone VARCHAR(20);
```

### 2. 앱 실행

```bash
./gradlew bootRun
```

Flyway가 자동으로:
1. `flyway_schema_history` 테이블에서 마지막 적용 버전 확인
2. 아직 적용 안 된 SQL 파일 발견
3. 버전 순서대로 실행
4. 실행 결과를 `flyway_schema_history`에 기록

### 3. 확인

```bash
# DB 접속
docker exec -it concurrency-lab-db psql -U app_user -d concurrency_lab

# 마이그레이션 이력 확인
SELECT version, description, installed_on, success FROM flyway_schema_history;

# 테이블 확인
\dt
```

## 핵심 규칙

### 1. 적용된 SQL은 절대 수정하지 않는다

이미 실행된 파일을 수정하면 체크섬 불일치 에러가 발생한다.
변경이 필요하면 **새 버전 파일을 추가**한다.

```
# 나쁜 예: V1 파일을 직접 수정
V1__create_member_table.sql  (수정 → 에러!)

# 좋은 예: 새 버전 추가
V1__create_member_table.sql  (원본 유지)
V2__alter_member_table.sql   (변경사항은 새 파일로)
```

### 2. 버전 번호는 순차적으로

```
V1 → V2 → V3  (O)
V1 → V3       (X, V2가 빠지면 안 됨)
```

### 3. 하나의 파일에는 하나의 변경만

```
# 좋은 예
V1__create_member_table.sql
V2__create_product_table.sql

# 나쁜 예
V1__create_all_tables.sql
```

## 개발 중 테이블을 완전히 초기화하고 싶을 때

```bash
# Docker 볼륨까지 삭제 후 재생성
docker-compose down -v
docker-compose up -d

# 앱 다시 실행하면 V1부터 다시 적용됨
./gradlew bootRun
```

## flyway_schema_history 테이블

Flyway가 자동 생성하는 이력 테이블:

| 컬럼 | 설명 |
|------|------|
| version | 마이그레이션 버전 |
| description | 설명 |
| script | 파일명 |
| checksum | 파일 체크섬 (변조 감지) |
| installed_on | 적용 일시 |
| execution_time | 실행 시간 (ms) |
| success | 성공 여부 |

## 트러블슈팅

### "Validate failed: Detected failed migration"
이전 마이그레이션이 실패한 상태. 개발 중이라면:
```bash
docker-compose down -v && docker-compose up -d
```

### "Checksum mismatch"
적용된 SQL 파일을 수정했을 때 발생. 파일을 원복하거나 DB 초기화.

### 마이그레이션이 실행 안 됨
- 파일명 형식 확인: `V숫자__설명.sql` (언더스코어 두 개)
- 파일 위치 확인: `src/main/resources/db/migration/`
- `spring.flyway.enabled=true` 확인
