package com.cj.freshway.fs.test.brandmng;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import com.cj.freshway.fs.common.base.GridResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional(readOnly = true)
public class BrandMngService {

	@Autowired
	BrandMngMapper brandMngMapper;

	/**
	 * <pre>
	 * 에어스타 브랜드 목록 조회
	 * </pre>
	 *
	 * @param BrandMngSearchDto
	 * @return GridResponse
	 * @throws BrandMngException
	 */
	public GridResponse<Integer, Integer, Object> selectBrandList(BrandMngSearchDto brandMngSearchDto)
			throws BrandMngException {

		Integer count = 0;

		try {
			List<BrandMng> brandList = brandMngMapper.selectBrandList(brandMngSearchDto);

			GridResponse<Integer, Integer, Object> response = new GridResponse<>();

		    if (!ObjectUtils.isEmpty(brandList)) {
				count = brandList.size();
		    }

			response.setLastRow(count);
			response.setLastPage(0);
			response.setData(brandList);

			return response;

	    } catch (Exception e) {
	        throw new BrandMngException(e);
	    }
	}

	/**
	 * <pre>
	 * 에어스타 브랜드 저장
	 * </pre>
	 *
	 * @param BrandMng
	 * @throws BrandMngException
	 */
	@Transactional
	public void saveBrandList(BrandMng brandMng) throws BrandMngException {
		try {
			List<BrandMng> brandList = brandMng.getBrandList();

			for (BrandMng brand : brandList) {
				String status = brand.getStatus();

				// 사용자 정보 set
				brand.setRegrId(brandMng.getRegrId());

				// status에 따라 INSERT 또는 UPDATE 처리
				if ("C".equals(status)) {
					brandMngMapper.insertBrand(brand);
				} else if ("U".equals(status)) {
					brandMngMapper.updateBrand(brand);
				}
			}
	    } catch (Exception e) {
	        throw new BrandMngException(e);
	    }
	}

	/**
	 * <pre>
	 * 플랫폼 브랜드 목록 조회
	 * </pre>
	 *
	 * @param BrandMngSearchDto
	 * @return GridResponse
	 * @throws BrandMngException
	 */
	public GridResponse<Integer, Integer, Object> selectPlatformBrandList(BrandMngSearchDto brandMngSearchDto)
			throws BrandMngException {

		Integer count = 0;

		try {
			List<BrandMng> platformBrandList = brandMngMapper.selectPlatformBrandList(brandMngSearchDto);

			GridResponse<Integer, Integer, Object> response = new GridResponse<>();

		    if (!ObjectUtils.isEmpty(platformBrandList)) {
				count = platformBrandList.size();
		    }

			response.setLastRow(count);
			response.setLastPage(0);
			response.setData(platformBrandList);

			return response;

	    } catch (Exception e) {
	        throw new BrandMngException(e);
	    }
	}

	/**
	 * <pre>
	 * 인천공항 데이터 수신
	 * </pre>
	 *
	 * @param BrandMngSearchDto
	 * @throws BrandMngException
	 */
	@Transactional
	public void recvIcnAirportData(BrandMngSearchDto brandMngSearchDto) throws BrandMngException {
		try {
			// TODO: 인천공항 데이터 수신 로직 구현
			log.info("인천공항 데이터 수신 - coId: {}, userid: {}",
					brandMngSearchDto.getCoId(), brandMngSearchDto.getUserid());

			// 실제 구현 시 외부 API 호출 또는 데이터 동기화 로직 추가

	    } catch (Exception e) {
	        throw new BrandMngException(e);
	    }
	}
}
