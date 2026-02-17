package com.cj.freshway.fs.cps.base.icnairportmng;

import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.cj.freshway.fs.cps.base.icnairportmng.dto.IcnAirportShopMngDto;
import com.cj.freshway.fs.cps.base.icnairportmng.dto.IcnAirportShopSaveRequestDto;
import com.cj.freshway.fs.cps.base.icnairportmng.entity.IcnAirportShopMngEntity;
import com.cj.freshway.fs.cps.common.base.FscpsBaseController;
import com.cj.freshway.fs.common.base.BaseException;
import com.cj.freshway.fs.common.base.GridResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

/**
 * @author System
 * @description
 *
 *              <pre>
 * 인천공항 매장 관리 Controller
 *              </pre>
 */
@Slf4j
@RestController
@RequestMapping("api/base/icnairportmng")
@Tag(name = "icnAirportShopMng", description = "인천공항 매장 관리 API")
public class IcnAirportShopMngController extends FscpsBaseController {

  @Autowired
  private IcnAirportShopMngService icnAirportShopMngService;

  /**
   * 인천공항 매장 목록 조회
   * 
   * @param request HttpServletRequest
   * @param dto 조회 조건
   * @return 매장 목록
   * @throws BaseException
   */
  @PostMapping("v1.0/selecticnairportshoplst")
  public Map<String, Object> selectIcnAirportShopLst(HttpServletRequest request,
      @RequestBody IcnAirportShopMngDto dto) throws BaseException {
    try {
      // 세션에서 coId 추출 (임시로 요청에서 받음)
      if (dto.getCoId() == null || dto.getCoId().trim().isEmpty()) {
        String coId = (String) request.getSession().getAttribute("g_coId");
        if (coId == null) {
          coId = "CO001"; // 임시 기본값
        }
        dto.setCoId(coId);
      }

      GridResponse<Integer, Integer, Object> response =
          icnAirportShopMngService.selectIcnAirportShopLst(dto);

      Map<String, Object> result = new HashMap<>();
      result.put("code", "200");
      result.put("message", "성공");
      result.put("data", response.getData());
      return result;
    } catch (BaseException e) {
      log.error("인천공항 매장 목록 조회 실패", e);
      Map<String, Object> result = new HashMap<>();
      result.put("code", "400");
      result.put("message", e.getMessage());
      result.put("data", null);
      return result;
    } catch (Exception e) {
      log.error("인천공항 매장 목록 조회 중 예외 발생", e);
      Map<String, Object> result = new HashMap<>();
      result.put("code", "500");
      result.put("message", "서버 내부 오류가 발생했습니다.");
      result.put("data", null);
      return result;
    }
  }

  /**
   * 인천공항 매장 상세 조회
   * 
   * @param request HttpServletRequest
   * @param dto 조회 조건
   * @return 매장 상세 정보
   * @throws BaseException
   */
  @PostMapping("v1.0/selecticnairportshopdtl")
  public Map<String, Object> selectIcnAirportShopDtl(HttpServletRequest request,
      @RequestBody IcnAirportShopMngDto dto) throws BaseException {
    try {
      // 세션에서 coId 추출 (임시로 요청에서 받음)
      if (dto.getCoId() == null || dto.getCoId().trim().isEmpty()) {
        String coId = (String) request.getSession().getAttribute("g_coId");
        if (coId == null) {
          coId = "CO001"; // 임시 기본값
        }
        dto.setCoId(coId);
      }

      IcnAirportShopMngEntity entity = icnAirportShopMngService.selectIcnAirportShopDtl(dto);

      Map<String, Object> result = new HashMap<>();
      if (entity != null) {
        result.put("code", "200");
        result.put("message", "성공");
        result.put("data", entity);
      } else {
        result.put("code", "404");
        result.put("message", "매장 정보를 찾을 수 없습니다.");
        result.put("data", null);
      }
      return result;
    } catch (BaseException e) {
      log.error("인천공항 매장 상세 조회 실패", e);
      Map<String, Object> result = new HashMap<>();
      result.put("code", "400");
      result.put("message", e.getMessage());
      result.put("data", null);
      return result;
    } catch (Exception e) {
      log.error("인천공항 매장 상세 조회 중 예외 발생", e);
      Map<String, Object> result = new HashMap<>();
      result.put("code", "500");
      result.put("message", "서버 내부 오류가 발생했습니다.");
      result.put("data", null);
      return result;
    }
  }

  /**
   * 인천공항 매장 신규 등록
   * 
   * @param request HttpServletRequest
   * @param requestDto 저장 요청 데이터
   * @return 저장 결과
   * @throws BaseException
   */
  @PostMapping("v1.0/inserticnairportshop")
  public Map<String, Object> insertIcnAirportShop(HttpServletRequest request,
      @RequestBody IcnAirportShopSaveRequestDto requestDto) throws BaseException {
    try {
      // 세션에서 coId와 userId 추출
      String coId = (String) request.getSession().getAttribute("g_coId");
      String userId = (String) request.getSession().getAttribute("g_userId");
      if (coId == null) {
        coId = "CO001"; // 임시 기본값
      }
      if (userId == null) {
        userId = "SYSTEM"; // 임시 기본값
      }

      Map<String, Object> data =
          icnAirportShopMngService.insertIcnAirportShop(requestDto, coId, userId);

      Map<String, Object> result = new HashMap<>();
      result.put("code", "200");
      result.put("message", "저장되었습니다.");
      result.put("data", data);
      return result;
    } catch (BaseException e) {
      log.error("인천공항 매장 신규 등록 실패", e);
      Map<String, Object> result = new HashMap<>();
      result.put("code", "400");
      result.put("message", e.getMessage());
      result.put("data", null);
      return result;
    } catch (Exception e) {
      log.error("인천공항 매장 신규 등록 중 예외 발생", e);
      Map<String, Object> result = new HashMap<>();
      result.put("code", "500");
      result.put("message", "서버 내부 오류가 발생했습니다.");
      result.put("data", null);
      return result;
    }
  }

  /**
   * 인천공항 매장 수정
   * 
   * @param request HttpServletRequest
   * @param requestDto 수정 요청 데이터
   * @return 수정 결과
   * @throws BaseException
   */
  @PostMapping("v1.0/updateicnairportshop")
  public Map<String, Object> updateIcnAirportShop(HttpServletRequest request,
      @RequestBody IcnAirportShopSaveRequestDto requestDto) throws BaseException {
    try {
      // 세션에서 coId와 userId 추출
      String coId = (String) request.getSession().getAttribute("g_coId");
      String userId = (String) request.getSession().getAttribute("g_userId");
      if (coId == null) {
        coId = "CO001"; // 임시 기본값
      }
      if (userId == null) {
        userId = "SYSTEM"; // 임시 기본값
      }

      Map<String, Object> data =
          icnAirportShopMngService.updateIcnAirportShop(requestDto, coId, userId);

      Map<String, Object> result = new HashMap<>();
      result.put("code", "200");
      result.put("message", "수정되었습니다.");
      result.put("data", data);
      return result;
    } catch (BaseException e) {
      log.error("인천공항 매장 수정 실패", e);
      Map<String, Object> result = new HashMap<>();
      result.put("code", "400");
      result.put("message", e.getMessage());
      result.put("data", null);
      return result;
    } catch (Exception e) {
      log.error("인천공항 매장 수정 중 예외 발생", e);
      Map<String, Object> result = new HashMap<>();
      result.put("code", "500");
      result.put("message", "서버 내부 오류가 발생했습니다.");
      result.put("data", null);
      return result;
    }
  }
}




