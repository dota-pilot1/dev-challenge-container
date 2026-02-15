package com.cj.freshway.fs.cps.common.service;

import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import com.cj.freshway.fs.cps.common.service.exception.MiddlewareApiException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

/**
 * @author System
 * @description
 *
 *              <pre>
 * 중계서버 API 호출 공통 서비스
 * opcode와 요청 데이터를 전달하여 중계서버로 요청을 전송합니다.
 * 중계서버가 opcode로 대상 URL과 메소드를 자동으로 처리합니다.
 *              </pre>
 */
@Slf4j
@Service
public class MiddlewareApiService {

  @Autowired
  private RestTemplate restTemplate;

  @Autowired
  private ObjectMapper objectMapper;

  /**
   * 중계서버 기본 URL (환경별로 설정 가능)
   * application.yml에 middleware.base-url 설정이 없으면 기본값 사용
   */
  @Value("${middleware.base-url:http://localhost:8080/api/interface}")
  private String middlewareBaseUrl;

  /**
   * POST 요청 전송
   *
   * @param opcode 업무코드 (예: "CP001")
   * @param requestData 요청 데이터
   * @param headers 추가 헤더 (선택, null 가능)
   * @return Map 응답 데이터
   * @throws MiddlewareApiException
   */
  public Map<String, Object> sendPostRequest(String opcode, Object requestData,
      Map<String, String> headers) throws MiddlewareApiException {
    try {
      // opcode 검증
      validateOpcode(opcode);

      // 요청 Body 구성 (opcode + body)
      Map<String, Object> requestBody = buildRequestBody(opcode, requestData);

      log.info("중계서버 POST 요청 시작 - Opcode: {}, URL: {}", opcode, middlewareBaseUrl);

      // 헤더 설정
      HttpHeaders httpHeaders = createHeaders(headers);
      HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, httpHeaders);

      // 요청 전송 - String으로 먼저 받아서 응답 내용 확인
      ResponseEntity<String> response = restTemplate.exchange(middlewareBaseUrl,
          HttpMethod.POST, requestEntity, String.class);

      log.info("중계서버 POST 요청 완료 - Opcode: {}, Status: {}", opcode,
          response.getStatusCode());

      // 응답 검증
      validateResponse(response);

      // 응답 본문 가져오기
      String responseBody = response.getBody();

      // 응답이 null이거나 비어있는 경우
      if (responseBody == null || responseBody.trim().isEmpty()) {
        return new HashMap<>();
      }

      // JSON으로 파싱 시도
      try {
        Map<String, Object> parsedResponse =
            objectMapper.readValue(responseBody, new TypeReference<Map<String, Object>>() {});
        return parsedResponse;
      } catch (Exception parseException) {
        // HTML이나 에러 페이지인 경우
        if (responseBody.trim().startsWith("<")) {
          throw new MiddlewareApiException("MIDDLEWARE_API_ERROR",
              "중계서버가 HTML 페이지를 반환했습니다. 인증 오류이거나 잘못된 URL일 수 있습니다. URL: "
                  + middlewareBaseUrl);
        }

        throw new MiddlewareApiException("MIDDLEWARE_API_ERROR",
            "중계서버 응답을 JSON으로 파싱할 수 없습니다: " + parseException.getMessage());
      }

    } catch (RestClientException e) {
      log.error("중계서버 POST 요청 실패 - Opcode: {}, Error: {}", opcode, e.getMessage(), e);
      throw new MiddlewareApiException("MIDDLEWARE_API_ERROR",
          "중계서버 API 호출 실패: " + e.getMessage());
    } catch (MiddlewareApiException e) {
      // 이미 우리가 던진 예외는 그대로 재전파
      throw e;
    } catch (Exception e) {
      log.error("중계서버 POST 요청 중 예외 발생 - Opcode: {}, Error: {}", opcode,
          e.getMessage(), e);
      throw new MiddlewareApiException("MIDDLEWARE_API_ERROR",
          "중계서버 API 호출 중 예외 발생: " + e.getMessage());
    }
  }

  /**
   * 헤더 생성
   *
   * @param headers 추가 헤더
   * @return HttpHeaders
   */
  private HttpHeaders createHeaders(Map<String, String> headers) {
    HttpHeaders httpHeaders = new HttpHeaders();
    httpHeaders.setContentType(MediaType.APPLICATION_JSON);

    if (headers != null && !headers.isEmpty()) {
      headers.forEach(httpHeaders::set);
    }

    return httpHeaders;
  }

  /**
   * opcode 검증
   *
   * @param opcode 업무코드
   * @throws MiddlewareApiException
   */
  private void validateOpcode(String opcode) throws MiddlewareApiException {
    if (opcode == null || opcode.trim().isEmpty()) {
      throw new MiddlewareApiException("INVALID_OPCODE", "업무코드가 없습니다.");
    }
  }

  /**
   * 요청 Body 구성 (opcode + body)
   *
   * @param opcode 업무코드
   * @param requestData 요청 데이터
   * @return 요청 Body Map
   */
  @SuppressWarnings("unchecked")
  private Map<String, Object> buildRequestBody(String opcode, Object requestData) {
    Map<String, Object> requestBody = new HashMap<>();
    
    // opcode 추가
    requestBody.put("opcode", opcode);
    
    // body에 requestData의 모든 필드를 그대로 포함
    Map<String, Object> body = new HashMap<>();
    if (requestData == null) {
      // requestData가 null인 경우 빈 body
      body = new HashMap<>();
    } else if (requestData instanceof Map) {
      Map<String, Object> dataMap = (Map<String, Object>) requestData;
      body.putAll(dataMap);
    } else {
      // DTO인 경우 그대로 포함
      body.put("data", requestData);
    }
    
    requestBody.put("body", body);
    
    return requestBody;
  }

  /**
   * 응답 검증
   *
   * @param response 응답
   * @throws MiddlewareApiException
   */
  private <T> void validateResponse(ResponseEntity<T> response) throws MiddlewareApiException {
    HttpStatus statusCode = response.getStatusCode();

    if (!statusCode.is2xxSuccessful()) {
      String errorMessage = String.format("중계서버 API 호출 실패 - Status: %s", statusCode);
      log.error(errorMessage);
      throw new MiddlewareApiException("MIDDLEWARE_API_ERROR", errorMessage);
    }
  }
}

