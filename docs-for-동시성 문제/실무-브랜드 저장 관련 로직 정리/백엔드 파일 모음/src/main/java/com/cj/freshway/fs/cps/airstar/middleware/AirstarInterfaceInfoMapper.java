package com.cj.freshway.fs.cps.airstar.middleware;

import org.apache.ibatis.annotations.Mapper;

import com.cj.freshway.fs.common.base.BaseException;
import com.cj.freshway.fs.cps.airstar.middleware.entity.MiddlewareIfReqEntity;

@Mapper
public interface AirstarInterfaceInfoMapper {	
	
	/**
	 * airstar 인터페이스 정보 조회 
	 * - BO --> 중계로 인터페이스 요청시 관련 정보를 조회
	 * @param AirstarInterfaceInfoDto
	 * @return
	 * @throws BaseException
	 */
	MiddlewareIfReqEntity getAirstarInterfaceInfo(String ifId) throws Exception;
	
}
