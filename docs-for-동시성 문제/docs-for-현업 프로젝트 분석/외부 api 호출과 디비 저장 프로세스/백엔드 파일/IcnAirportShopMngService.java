package com.cj.freshway.fs.cps.base.icnairportmng;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.cj.freshway.fs.cps.base.icnairportmng.dto.IcnAirportShopMngDto;
import com.cj.freshway.fs.cps.base.icnairportmng.dto.IcnAirportShopSaveRequestDto;
import com.cj.freshway.fs.cps.base.icnairportmng.entity.IcnAirportShopMngEntity;
import com.cj.freshway.fs.cps.common.service.MiddlewareApiService;
import com.cj.freshway.fs.cps.common.service.exception.MiddlewareApiException;
import com.cj.freshway.fs.common.base.BaseException;
import com.cj.freshway.fs.common.base.GridResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

/**
 * @author System
 * @description
 *
 *              <pre>
 * 인천공항 매장 관리 Service
 *              </pre>
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class IcnAirportShopMngService {

  @Autowired
  private IcnAirportShopMngMapper icnAirportShopMngMapper;

  @Autowired
  private MiddlewareApiService middlewareApiService;

  private static final String INTERFACE_CODE_INSERT = "FS-CPS-ICN-SHOP-INSERT";
  private static final String INTERFACE_CODE_UPDATE = "FS-CPS-ICN-SHOP-UPDATE";

  private final ObjectMapper objectMapper = new ObjectMapper();

  /**
   * 인천공항 매장 목록 조회
   * 
   * @param dto 조회 조건
   * @return 매장 목록
   * @throws BaseException
   */
  public GridResponse<Integer, Integer, Object> selectIcnAirportShopLst(IcnAirportShopMngDto dto)
      throws BaseException {
    try {
      List<IcnAirportShopMngEntity> list = icnAirportShopMngMapper.selectIcnAirportShopLst(dto);

      GridResponse<Integer, Integer, Object> response = new GridResponse<>();
      response.setLastRow(list.size());
      response.setData(list);
      return response;
    } catch (Exception e) {
      log.error("인천공항 매장 목록 조회 실패", e);
      throw new BaseException(e);
    }
  }

  /**
   * 인천공항 매장 상세 조회
   * 
   * @param dto 조회 조건
   * @return 매장 상세 정보
   * @throws BaseException
   */
  public IcnAirportShopMngEntity selectIcnAirportShopDtl(IcnAirportShopMngDto dto)
      throws BaseException {
    try {
      IcnAirportShopMngEntity entity = icnAirportShopMngMapper.selectIcnAirportShopDtl(dto);
      if (entity != null) {
        // JSON 문자열을 Map으로 변환
        entity.setStoreNames(convertJsonStringToMap(entity.getStoreNamesJson()));
        entity.setStoreNotices(convertJsonStringToMap(entity.getStoreNoticesJson()));
      }
      return entity;
    } catch (Exception e) {
      log.error("인천공항 매장 상세 조회 실패", e);
      throw new BaseException(e);
    }
  }

  /**
   * 인천공항 매장 신규 등록
   * 
   * @param requestDto 저장 요청 데이터
   * @param coId 회사 ID
   * @param userId 사용자 ID
   * @return 저장된 매장 ID
   * @throws BaseException
   */
  @Transactional
  public Map<String, Object> insertIcnAirportShop(IcnAirportShopSaveRequestDto requestDto,
      String coId, String userId) throws BaseException {
    try {
      // 유효성 검증
      validateSaveRequest(requestDto);

      // 매장 존재 여부 확인
      IcnAirportShopMngDto checkDto = new IcnAirportShopMngDto();
      checkDto.setCoId(coId);
      checkDto.setStoreId(requestDto.getStoreId());
      int exists = icnAirportShopMngMapper.checkIcnAirportShopExists(checkDto);
      if (exists > 0) {
        throw new BaseException("이미 존재하는 매장입니다.");
      }

      // Entity 생성
      IcnAirportShopMngEntity entity = new IcnAirportShopMngEntity();
      entity.setCoId(coId);
      entity.setShopId(requestDto.getStoreId()); // 임시로 storeId 사용
      entity.setSteId("ICN001"); // 임시로 고정값 사용 (실제로는 파라미터로 받아야 함)
      entity.setCrnrId("CRNR001"); // 임시로 고정값 사용 (실제로는 파라미터로 받아야 함)
      entity.setBrandId(requestDto.getBrandId());
      entity.setSalesUnitCode(requestDto.getSalesUnitCode());
      entity.setStoreId(requestDto.getStoreId());
      entity.setStoreType(requestDto.getStoreType());
      entity.setTelephone(requestDto.getTelephone());
      entity.setStoreNamesJson(convertMapToJsonString(requestDto.getStoreNames()));
      entity.setStoreNoticesJson(convertMapToJsonString(requestDto.getStoreNotices()));
      entity.setUseYn(requestDto.getUseYn());
      entity.setRegrId(userId);
      entity.setUpdtId(userId);

      // DB 저장
      int result = icnAirportShopMngMapper.insertIcnAirportShop(entity);
      if (result == 0) {
        throw new BaseException("매장 등록에 실패했습니다.");
      }

      // 중계서버 호출
      callMiddlewareApi(INTERFACE_CODE_INSERT, requestDto, coId);

      Map<String, Object> response = new HashMap<>();
      response.put("storeId", requestDto.getStoreId());
      return response;
    } catch (BaseException e) {
      throw e;
    } catch (Exception e) {
      log.error("인천공항 매장 신규 등록 실패", e);
      throw new BaseException(e);
    }
  }

  /**
   * 인천공항 매장 수정
   * 
   * @param requestDto 수정 요청 데이터
   * @param coId 회사 ID
   * @param userId 사용자 ID
   * @return 수정된 매장 ID
   * @throws BaseException
   */
  @Transactional
  public Map<String, Object> updateIcnAirportShop(IcnAirportShopSaveRequestDto requestDto,
      String coId, String userId) throws BaseException {
    try {
      // 유효성 검증
      validateSaveRequest(requestDto);

      // 매장 존재 여부 확인
      IcnAirportShopMngDto checkDto = new IcnAirportShopMngDto();
      checkDto.setCoId(coId);
      checkDto.setStoreId(requestDto.getStoreId());
      int exists = icnAirportShopMngMapper.checkIcnAirportShopExists(checkDto);
      if (exists == 0) {
        throw new BaseException("존재하지 않는 매장입니다.");
      }

      // Entity 생성
      IcnAirportShopMngEntity entity = new IcnAirportShopMngEntity();
      entity.setCoId(coId);
      entity.setShopId(requestDto.getStoreId()); // 임시로 storeId 사용
      entity.setSteId("ICN001"); // 임시로 고정값 사용 (실제로는 파라미터로 받아야 함)
      entity.setBrandId(requestDto.getBrandId());
      entity.setSalesUnitCode(requestDto.getSalesUnitCode());
      entity.setStoreId(requestDto.getStoreId());
      entity.setStoreType(requestDto.getStoreType());
      entity.setTelephone(requestDto.getTelephone());
      entity.setStoreNamesJson(convertMapToJsonString(requestDto.getStoreNames()));
      entity.setStoreNoticesJson(convertMapToJsonString(requestDto.getStoreNotices()));
      entity.setUseYn(requestDto.getUseYn());
      entity.setUpdtId(userId);

      // DB 수정
      int result = icnAirportShopMngMapper.updateIcnAirportShop(entity);
      if (result == 0) {
        throw new BaseException("매장 수정에 실패했습니다.");
      }

      // 중계서버 호출
      callMiddlewareApi(INTERFACE_CODE_UPDATE, requestDto, coId);

      Map<String, Object> response = new HashMap<>();
      response.put("storeId", requestDto.getStoreId());
      return response;
    } catch (BaseException e) {
      throw e;
    } catch (Exception e) {
      log.error("인천공항 매장 수정 실패", e);
      throw new BaseException(e);
    }
  }

  /**
   * 중계서버 API 호출
   * 
   * @param interfaceCode 인터페이스 코드
   * @param requestDto 요청 데이터
   * @param coId 회사 ID
   */
  private void callMiddlewareApi(String interfaceCode, IcnAirportShopSaveRequestDto requestDto,
      String coId) {
    try {
      // 요청 데이터 구성
      Map<String, Object> requestData = new HashMap<>();
      requestData.put("coId", coId);
      requestData.put("brandId", requestDto.getBrandId());
      requestData.put("salesUnitCode", requestDto.getSalesUnitCode());
      requestData.put("storeId", requestDto.getStoreId());
      requestData.put("storeType", requestDto.getStoreType());
      requestData.put("telephone", requestDto.getTelephone());
      requestData.put("storeNames", requestDto.getStoreNames());
      requestData.put("storeNotices", requestDto.getStoreNotices());
      requestData.put("useYn", requestDto.getUseYn());

      // 중계서버 호출
      Map<String, Object> response =
          middlewareApiService.sendPostRequest(interfaceCode, requestData, null);

      log.info("중계서버 API 호출 성공 - InterfaceCode: {}", interfaceCode);
    } catch (MiddlewareApiException e) {
      log.error("중계서버 API 호출 실패 - InterfaceCode: {}, Code: {}, Message: {}", interfaceCode,
          e.getCode(), e.getMessage(), e);
      // 중계서버 호출 실패해도 DB 저장은 유지 (비동기 처리 고려)
      // 필요시 예외를 다시 throw하여 트랜잭션 롤백 가능
    } catch (Exception e) {
      log.error("중계서버 API 호출 중 예외 발생 - InterfaceCode: {}", interfaceCode, e);
    }
  }

  /**
   * 저장 요청 유효성 검증
   * 
   * @param requestDto 요청 데이터
   * @throws BaseException
   */
  private void validateSaveRequest(IcnAirportShopSaveRequestDto requestDto) throws BaseException {
    if (requestDto.getBrandId() == null || requestDto.getBrandId().trim().isEmpty()) {
      throw new BaseException("필수 입력 항목이 누락되었습니다. (brandId)");
    }
    if (requestDto.getSalesUnitCode() == null || requestDto.getSalesUnitCode().trim().isEmpty()) {
      throw new BaseException("필수 입력 항목이 누락되었습니다. (salesUnitCode)");
    }
    if (requestDto.getStoreId() == null || requestDto.getStoreId().trim().isEmpty()) {
      throw new BaseException("필수 입력 항목이 누락되었습니다. (storeId)");
    }
    if (requestDto.getStoreType() == null || requestDto.getStoreType().trim().isEmpty()) {
      throw new BaseException("필수 입력 항목이 누락되었습니다. (storeType)");
    }
    if (requestDto.getTelephone() == null || requestDto.getTelephone().trim().isEmpty()) {
      throw new BaseException("필수 입력 항목이 누락되었습니다. (telephone)");
    }
    if (requestDto.getStoreNames() == null || requestDto.getStoreNames().isEmpty()
        || requestDto.getStoreNames().get("ko-kr") == null
        || requestDto.getStoreNames().get("ko-kr").trim().isEmpty()) {
      throw new BaseException("필수 입력 항목이 누락되었습니다. (storeNames.ko-kr)");
    }
    if (requestDto.getUseYn() == null
        || (!requestDto.getUseYn().equals("Y") && !requestDto.getUseYn().equals("N"))) {
      throw new BaseException("사용여부는 Y 또는 N만 허용됩니다.");
    }
  }

  /**
   * Map을 JSON 문자열로 변환
   * 
   * @param map 변환할 Map
   * @return JSON 문자열
   */
  private String convertMapToJsonString(Map<String, String> map) {
    if (map == null || map.isEmpty()) {
      return null;
    }
    try {
      return objectMapper.writeValueAsString(map);
    } catch (Exception e) {
      log.error("Map을 JSON 문자열로 변환 실패", e);
      return null;
    }
  }

  /**
   * JSON 문자열을 Map으로 변환
   * 
   * @param jsonString 변환할 JSON 문자열
   * @return Map
   */
  private Map<String, String> convertJsonStringToMap(String jsonString) {
    if (jsonString == null || jsonString.trim().isEmpty()) {
      return null;
    }
    try {
      return objectMapper.readValue(jsonString, new TypeReference<Map<String, String>>() {});
    } catch (Exception e) {
      log.error("JSON 문자열을 Map으로 변환 실패", e);
      return null;
    }
  }
}

