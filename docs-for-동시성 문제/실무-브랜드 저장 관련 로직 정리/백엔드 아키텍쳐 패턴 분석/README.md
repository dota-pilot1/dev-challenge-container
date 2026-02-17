# 백엔드 아키텍쳐 패턴 분석

## 1) 한 줄 요약
이 프로젝트는 **도메인 패키지 기반 3계층(Controller-Service-Mapper) + XML SQL(MyBatis) + 외부연동 어댑터(MiddlewareApiManager)** 패턴입니다.

## 2) 기술/런타임 핵심
- Spring Boot 2.7.x, Java 11, Maven
- Spring Web, Security(JWT 필터), Validation
- MyBatis + Mapper XML
- PostgreSQL(H2 런타임 포함), Redis
- RestTemplate 기반 외부 API 호출

참고:
- `pom.xml`
- `src/main/java/com/cj/freshway/fs/config/security/SecurityConfig.java`
- `src/main/java/com/cj/freshway/fs/config/datasource/DataSourceConfig.java`
- `src/main/java/com/cj/freshway/fs/config/resttemplate/ResttemplateConfig.java`

## 3) 계층 구조(브랜드 저장 기준)
- Controller: HTTP 요청/응답, 입력 DTO 전달
- Service: 트랜잭션, 비즈니스 분기(C/U), 외부 연동 호출
- Mapper(Java): SQL 메서드 선언
- Mapper(XML): 실제 SQL(INSERT/UPDATE/UPSERT)
- MiddlewareApiManager: 중계 서버 호출 공통 처리

핵심 파일:
- `src/main/java/com/cj/freshway/fs/cps/airstar/brand/AirstarBrandController.java`
- `src/main/java/com/cj/freshway/fs/cps/airstar/brand/AirstarBrandService.java`
- `src/main/java/com/cj/freshway/fs/cps/airstar/brand/AirstarBrandMapper.java`
- `src/main/resources/mappers/cps/airstar/AirstarBrandMapper.xml`
- `src/main/java/com/cj/freshway/fs/cps/airstar/middleware/MiddlewareApiManager.java`
- `src/main/resources/mappers/cps/airstar/AirstarInterfaceInfoMapper.xml`

## 4) 요청 처리 흐름(브랜드 저장)
`Client -> AirstarBrandController -> AirstarBrandService(@Transactional)`

`-> AirstarBrandMapper(내부 DB 저장)`

`-> MiddlewareApiManager -> 중계서버(GWMS) -> 외부 Airstar API(CP204/CP206)`

`-> 응답 반환`

## 5) 재현할 때 핵심 포인트
- 패키지 단위를 `domain + common + config`로 분리
- DB 트랜잭션 경계와 외부 API 호출 경계를 명확히 분리 설계
- Mapper 인터페이스/Mapper XML 1:1 유지
- 외부 연동은 공통 매니저(타임아웃/헤더/로깅)로 일원화
