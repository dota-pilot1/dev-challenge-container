package com.cj.freshway.fs.cps.base.icnairportmng;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import com.cj.freshway.fs.cps.base.icnairportmng.dto.IcnAirportShopMngDto;
import com.cj.freshway.fs.cps.base.icnairportmng.entity.IcnAirportShopMngEntity;

/**
 * @author System
 * @description
 *
 *              <pre>
 * 인천공항 매장 관리 Mapper
 *              </pre>
 */
@Mapper
public interface IcnAirportShopMngMapper {

  /**
   * 인천공항 매장 목록 조회
   * 
   * @param dto 조회 조건
   * @return 매장 목록
   */
  List<IcnAirportShopMngEntity> selectIcnAirportShopLst(IcnAirportShopMngDto dto);

  /**
   * 인천공항 매장 상세 조회
   * 
   * @param dto 조회 조건
   * @return 매장 상세 정보
   */
  IcnAirportShopMngEntity selectIcnAirportShopDtl(IcnAirportShopMngDto dto);

  /**
   * 인천공항 매장 존재 여부 확인
   * 
   * @param dto 조회 조건
   * @return 존재 여부 (1: 존재, 0: 없음)
   */
  int checkIcnAirportShopExists(IcnAirportShopMngDto dto);

  /**
   * 인천공항 매장 신규 등록
   * 
   * @param entity 매장 정보
   * @return 등록 건수
   */
  int insertIcnAirportShop(IcnAirportShopMngEntity entity);

  /**
   * 인천공항 매장 수정
   * 
   * @param entity 매장 정보
   * @return 수정 건수
   */
  int updateIcnAirportShop(IcnAirportShopMngEntity entity);
}




