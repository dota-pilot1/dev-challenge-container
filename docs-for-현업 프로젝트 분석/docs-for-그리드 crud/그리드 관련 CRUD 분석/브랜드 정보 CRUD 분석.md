# 브랜드 정보 그리드 CRUD 분석

## 1. 개요
본 문서는 "교통/시설 > 기준정보 > 브랜드 조회" (BrandRtrv) 메뉴의 그리드 기반 CRUD 구현 로직을 분석합니다.
프론트엔드에서는 Tabulator 그리드를 사용하여 데이터를 표시 및 편집하고, 백엔드에서는 Controller-Service-Mapper 구조를 통해 데이터를 처리합니다.

## 2. 프론트엔드 로직

### 2.1 파일 구성
- **메인 페이지**: `src/pages/cps/base/brandmng/BrandRtrv.jsx`
- **그리드 컴포넌트**: `src/components/cps/base/brandmng/BrandRtrvAirstarGrid.jsx` (에어스타 브랜드 목록)
- **API 연동**: `src/api/cps/base/brandmng/BrandRtrv-fetch.js`

### 2.2 조회 프로세스 (Read)
1. **이벤트 트리거**: 사용자가 조회 버튼 클릭 시 `handleAirstarSearch` 함수 실행.
2. **API 호출**: `fetchBrandList` (in `BrandRtrv-fetch.js`) 호출.
   - URL: `/api/test/brandmng/v1.0/brandList`
3. **데이터 바인딩**: 응답 데이터를 `setAirstarList`를 통해 State에 저장하고, 이를 `BrandRtrvAirstarGrid` 컴포넌트의 `data` prop으로 전달.
4. **그리드 렌더링**: `SimpleTabulator` 컴포넌트가 데이터를 받아 테이블 형태로 렌더링.

### 2.3 저장 프로세스 (Create/Update)
1. **데이터 수정**: 그리드 내에서 데이터 편집 또는 '신규' 버튼을 통해 행 추가.
2. **저장 요청**: 저장 버튼 클릭 시 `handleAirstarSave` 함수 실행.
3. **API 호출**: `fetchSaveBrand` (in `BrandRtrv-fetch.js`) 호출.
   - URL: `/api/test/brandmng/v1.0/saveBrand`
   - Payload: 그리드의 변경된 데이터 목록 (insert/update 구분 플래그 `_flag` 사용 가능성 있음).

## 3. 백엔드 로직

### 3.1 파일 구성
- **Controller**: `com.cj.freshway.fs.test.brandmng.BrandMngController.java`
- **Service**: `com.cj.freshway.fs.test.brandmng.BrandMngService.java`
- **Mapper**: `com.cj.freshway.fs.test.brandmng.BrandMngMapper.java` / `BrandMngMapper.xml`
- **DTO**: `BrandMng.java`, `BrandMngSearchDto.java`

### 3.2 조회 로직
- **Controller**: `selectBrandList` 메서드에서 요청 수신.
- **Service**: `selectBrandList` 호출.
- **Mapper**: `selectBrandList` 쿼리 실행 (DB에서 브랜드 목록 조회).

### 3.3 저장 로직
- **Controller**: `saveBrand` 메서드에서 요청 수신 (`@RequestBody`로 리스트 또는 객체 수신).
- **Service**: `saveBrand` 메서드에서 트랜잭션 관리 (`@Transactional`).
  - 데이터의 상태(신규/수정)를 판단하여 `insert` 또는 `update` 수행.
- **Mapper**: 실제 `INSERT` 또는 `UPDATE` SQL 실행.

## 4. 데이터 흐름 요약
`[Browser] Grid UI` -> `[React] BrandRtrv.jsx` -> `[API] Axios (fetch.js)` -> `[Server] Controller` -> `[Server] Service` -> `[DB] Mapper/XML`
