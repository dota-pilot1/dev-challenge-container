# 프론트 엔드 아키텍쳐 패턴

## 1) 현재 저장소 기준 사실관계
이 저장소는 백엔드 API 중심이며, 브랜드 저장 화면을 구성하는 SPA 소스(React/Vue/TS)는 포함되어 있지 않습니다.

확인된 정적 리소스:
- `src/main/resources/public/js/*` (viewer/jQuery 등 배포 자산)
- `src/main/resources/public/css/*`
- `src/main/resources/static/*` (엑셀 템플릿/파일)

## 2) 그래서 프론트 패턴은 어떻게 잡는 게 맞나
실습용 프론트는 **API 중심 CRUD + 상태 가시화** 패턴으로 별도 구성하는 게 맞습니다.

권장 원칙:
- 화면 로직과 API 클라이언트 분리
- 요청/응답 DTO 타입 분리
- 실패건 재시도/상태필터 UI를 별도 컴포넌트로 분리
- 동시성 실험을 위해 동일 요청 반복/병렬 버튼 제공
