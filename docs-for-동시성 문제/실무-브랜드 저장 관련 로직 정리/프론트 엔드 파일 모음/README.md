# 브랜드 저장 관련 프론트 파일 모음

현재 저장소(cjfw-fscps-bo-api)는 백엔드 API 중심이며,
브랜드 저장 엔드포인트(/api/airstar/brands/partner-brands-save)를 직접 호출하는 별도 프론트 소스(React/Vue/JSP)는 확인되지 않았습니다.

검색 기준:
- partner-brands-save
- /api/middleware/brands

확인된 호출 진입점은 백엔드 컨트롤러입니다.
- src/main/java/com/cj/freshway/fs/cps/airstar/brand/AirstarBrandController.java
