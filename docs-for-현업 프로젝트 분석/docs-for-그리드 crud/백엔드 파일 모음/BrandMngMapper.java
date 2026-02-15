package com.cj.freshway.fs.test.brandmng;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BrandMngMapper {
	/**
	 * <pre>
	 * 에어스타 브랜드 목록 조회
	 * </pre>
	 *
	 * @param BrandMngSearchDto
	 * @return List<BrandMng>
	 * @throws BrandMngException
	 */
	List<BrandMng> selectBrandList(BrandMngSearchDto brandMngSearchDto) throws BrandMngException;

	/**
	 * <pre>
	 * 에어스타 브랜드 등록
	 * </pre>
	 *
	 * @param BrandMng
	 * @return void
	 * @throws BrandMngException
	 */
	void insertBrand(BrandMng brandMng) throws BrandMngException;

	/**
	 * <pre>
	 * 에어스타 브랜드 수정
	 * </pre>
	 *
	 * @param BrandMng
	 * @return void
	 * @throws BrandMngException
	 */
	void updateBrand(BrandMng brandMng) throws BrandMngException;

	/**
	 * <pre>
	 * 플랫폼 브랜드 목록 조회
	 * </pre>
	 *
	 * @param BrandMngSearchDto
	 * @return List<BrandMng>
	 * @throws BrandMngException
	 */
	List<BrandMng> selectPlatformBrandList(BrandMngSearchDto brandMngSearchDto) throws BrandMngException;
}
