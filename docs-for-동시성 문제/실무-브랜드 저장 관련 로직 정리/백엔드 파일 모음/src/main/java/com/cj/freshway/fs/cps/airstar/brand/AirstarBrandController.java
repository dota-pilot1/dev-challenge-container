package com.cj.freshway.fs.cps.airstar.brand;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cj.freshway.fs.cps.airstar.brand.dto.PartnerBrandReqDto;
import com.cj.freshway.fs.cps.airstar.brand.entity.PartnerBrandEntity;
import com.cj.freshway.fs.cps.airstar.brand.entity.PlatformBrandEntity;
import com.cj.freshway.fs.cps.airstar.middleware.dto.MiddlewareResDto;
import com.cj.freshway.fs.cps.common.base.FscpsBaseController;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

/**
 * @author Choick
 * @description
 *  
 *              <pre>
 * Airstar 플랫폼의 카테고리 관련 API 조회용 컨트롤러
 *              </pre>
 */

@Slf4j
@RestController
@RequestMapping("api/airstar/brands") //real
@Tag(name = "airstar brand", description = "airstar brand API")
public class AirstarBrandController extends FscpsBaseController {
	
	@Autowired
	AirstarBrandService airstarBrandService;
	
	/*플랫폼 브랜드 조회 API 연동 및 결과 데이터 DB 저장*/	
	@GetMapping("/airstar-platform-brands")
	public ResponseEntity<MiddlewareResDto<Map<String, Object>>> getPlatformBrands(HttpServletRequest req) throws Exception {

		log.info("[플랫폼 브랜드 조회 API]>>>>>");
		return airstarBrandService.getPlatformBrands(req);		
	}	
	
	/*화면 조회버튼 클릭시 db 저장된 플랫폼 브랜드 조회 결과 반환*/	 
	@GetMapping("/platform-brands")
	public List<PlatformBrandEntity> getPlatformBrandsFromDb(HttpServletRequest req) throws Exception {
		//현재 미작업
		log.info("[플랫폼 브랜드 db 조회]>>>>>");		
		List<PlatformBrandEntity> list = airstarBrandService.selectPlatformBrands(req);
		
		return list;
	}
		
	/*입점사 공항공사 브랜드 조회 API*/
	//해당 API는 화면에서 미사용, 추후 배치에서 내부 DB 동기화에 사용예정? 
	@GetMapping("/airstar-partner-brands")
	public ResponseEntity<MiddlewareResDto<Map<String, Object>>> getPartenrBrands(HttpServletRequest req, @RequestParam Map<String, Object> param) throws Exception {

		log.info("[입점사 브랜드 플랫폼 API  조회]>>>>>");		
		return airstarBrandService.getPartnerBrands(req, param);
	}
	
	/*입점사 브랜드 db 조회*/
	//화면 그리드에서 조회
	@GetMapping("/partner-brands")
	public List<PartnerBrandEntity> selectPartnerBrands(HttpServletRequest req) throws Exception {
		//현재 미작업
		log.info("[파트너 브랜드 db 조회]>>>>>");			
		return airstarBrandService.selectPartnerBrands(req);		
	}	
					
	/*입점사 브랜드 저장 - 그리드를 통해 신규/수정 행들에 대해 각 수정/등록 API 연동 및 자체 DB에 저장*/
	@PostMapping("/partner-brands-save")
	public String savePartenrBrands(HttpServletRequest req, @RequestBody List<PartnerBrandReqDto> partnerBrandReqList) throws Exception {
		airstarBrandService.savePartenrBrands(partnerBrandReqList);
		
		log.info("[입점사 공항공사 등록]>>>>>");
		return "";
	}	
}