package com.cj.freshway.fs.cps.airstar.brand;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.cj.freshway.fs.common.base.BaseException;
import com.cj.freshway.fs.cps.airstar.brand.dto.PartnerBrandReqDto;
import com.cj.freshway.fs.cps.airstar.brand.entity.PartnerBrandEntity;
import com.cj.freshway.fs.cps.airstar.brand.entity.PlatformBrandEntity;

/**
 * @author choick
 * @description
 *
 *              <pre>
 * 플랫폼 브랜드 관리 
 *              </pre>
 */
@Mapper
public interface AirstarBrandMapper {
	
	/**
	 * 플랫폼 브랜드 정보 upsert
	 * @param PlatformBrandEntity
	 * @return
	 * @throws BaseException
	 */
	
	Integer upsertPlatformBrand(PlatformBrandEntity PlatformBrandEntity) throws BaseException;
	
	/**
	 * 플랫폼 브랜드 정보 조회
	 * @param PlatformBrandEntity
	 * @return
	 * @throws BaseException
	 */
	List<PlatformBrandEntity> selectPlatformBrands() throws BaseException;
	
	/**
	 * 파트너 브랜드 정보 insert
	 * @param 
	 * @return
	 * @throws BaseException
	 */
	
	Integer insertPartnerBrand(PartnerBrandReqDto dto) throws BaseException;
	
	
	/**
	 * 파트너 브랜드 update 
	 * @param 
	 * @return
	 * @throws BaseException
	 */
	
	Integer updatePartnerBrand(PartnerBrandReqDto dto) throws BaseException;
	
	
	/**
	 * 파트너 브랜드 정보 조회
	 * @param PlatformBrandEntity
	 * @return
	 * @throws BaseException
	 */
	List<PartnerBrandEntity> selectPartnerBrands() throws BaseException;	
	
	
	
	/**
	 * 파트너 브랜드 update 
	 * @param 
	 * @return
	 * @throws BaseException
	 */
	
	Integer updatePartnerBrandBatch(PartnerBrandEntity entity) throws BaseException;

}
