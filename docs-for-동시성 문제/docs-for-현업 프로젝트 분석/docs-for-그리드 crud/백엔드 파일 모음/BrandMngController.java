package com.cj.freshway.fs.test.brandmng;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cj.freshway.fs.common.base.GridResponse;
import com.cj.freshway.fs.cps.common.base.FscpsBaseController;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("api/test/brandmng")
public class BrandMngController extends FscpsBaseController {

	@Autowired
	private BrandMngService brandMngService;

	/**
	 * <pre>
	 * 에어스타 브랜드 목록 조회
	 * </pre>
	 *
	 * @author Claude
	 * @param BrandMngSearchDto
	 * @return GridResponse
	 * @throws BrandMngException
	 */
	@PostMapping("v1.0/brandList")
	public GridResponse<Integer, Integer, Object> brandList(
		@RequestBody BrandMngSearchDto brandMngSearchDto) throws BrandMngException {

		return brandMngService.selectBrandList(brandMngSearchDto);
	}

	/**
	 * <pre>
	 * 에어스타 브랜드 저장
	 * </pre>
	 *
	 * @author Claude
	 * @param BrandMng
	 * @return void
	 * @throws BrandMngException
	 */
	@PostMapping("v1.0/saveBrand")
	public void saveBrand(@RequestBody BrandMng brandMng) throws BrandMngException {
		log.info("saveBrand : {}", brandMng);
		brandMngService.saveBrandList(brandMng);
	}

	/**
	 * <pre>
	 * 플랫폼 브랜드 목록 조회
	 * </pre>
	 *
	 * @author Claude
	 * @param BrandMngSearchDto
	 * @return GridResponse
	 * @throws BrandMngException
	 */
	@PostMapping("v1.0/platformBrandList")
	public GridResponse<Integer, Integer, Object> platformBrandList(
		@RequestBody BrandMngSearchDto brandMngSearchDto) throws BrandMngException {

		return brandMngService.selectPlatformBrandList(brandMngSearchDto);
	}

	/**
	 * <pre>
	 * 인천공항 데이터 수신
	 * </pre>
	 *
	 * @author Claude
	 * @param BrandMngSearchDto
	 * @return void
	 * @throws BrandMngException
	 */
	@PostMapping("v1.0/recvIcnAirportData")
	public void recvIcnAirportData(@RequestBody BrandMngSearchDto brandMngSearchDto) throws BrandMngException {
		log.info("recvIcnAirportData : {}", brandMngSearchDto);
		brandMngService.recvIcnAirportData(brandMngSearchDto);
	}
}
