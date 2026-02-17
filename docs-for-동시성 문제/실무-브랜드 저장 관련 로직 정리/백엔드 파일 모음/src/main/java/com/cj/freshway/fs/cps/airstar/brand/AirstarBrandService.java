package com.cj.freshway.fs.cps.airstar.brand;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cj.freshway.fs.cps.airstar.brand.dto.PartnerBrandApiRegReqDto;
import com.cj.freshway.fs.cps.airstar.brand.dto.PartnerBrandApiResDto;
import com.cj.freshway.fs.cps.airstar.brand.dto.PartnerBrandReqDto;
import com.cj.freshway.fs.cps.airstar.brand.dto.PlatformBrandApiResDto;
import com.cj.freshway.fs.cps.airstar.brand.entity.PartnerBrandEntity;
import com.cj.freshway.fs.cps.airstar.brand.entity.PlatformBrandEntity;
import com.cj.freshway.fs.cps.airstar.common.enums.AirstarResCodeEnum;
import com.cj.freshway.fs.cps.airstar.middleware.AirstarInterfaceInfoMapper;
import com.cj.freshway.fs.cps.airstar.middleware.MiddlewareApiManager;
import com.cj.freshway.fs.cps.airstar.middleware.dto.MiddlewareReqDto;
import com.cj.freshway.fs.cps.airstar.middleware.dto.MiddlewareResDto;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AirstarBrandService {
	
	@Autowired
	AirstarInterfaceInfoMapper airstarInterfaceInfoMapper;
	
	@Autowired
	MiddlewareApiManager middlewareApiManager;
	
	@Autowired
	AirstarBrandMapper airstarBrandMapper;
	
	@Autowired
	Environment env;
	
	@Autowired
	ObjectMapper objectMapper;
	
	//Transaction과 API 요청을 분리하기 위하 사용
	@Autowired
	ApplicationEventPublisher eventPublisher;
	
	/*플랫폼 브랜드 조회 결과 db 저장
	 * */
	public ResponseEntity<MiddlewareResDto<Map<String, Object>>> getPlatformBrands(HttpServletRequest req) throws Exception {			 
		
		String ifId = "CP203";//플랫폼 브랜드 조회
									
		//중계서버 요청에 필요한 정보 세팅 - url, method 등				
		MiddlewareReqDto<Map<String, Object>> reqDto = middlewareApiManager.getInterfaceInfo(ifId);			
		
		log.info("[전송데이터]{}", reqDto.toString());
		
	
		//응답이 map 
		ResponseEntity<MiddlewareResDto<Map<String, Object>>> res = middlewareApiManager.sendRequest(
																								reqDto, 
																								new ParameterizedTypeReference<MiddlewareResDto<Map<String, Object>>>() {}
																								);
		
		//플랫폼 응답 코드 확인
		AirstarResCodeEnum resultCode = AirstarResCodeEnum.from(res.getBody().getCode());
		log.info("res.getBody().getCode() : {}, resultCode.isSuccess() : {}", res.getBody().getCode(), resultCode.isSuccess());
				
		if (resultCode.isSuccess()) {
			
			//조회 후 자체 DB와 동기화
			Map<String,Object> resMap = (Map<String, Object>)res.getBody().getData();			
						
			Object brandsObj = resMap.get("brands");

			//json to object, 
			List<PlatformBrandApiResDto> brands = objectMapper.convertValue(
			        brandsObj,
			        new TypeReference<List<PlatformBrandApiResDto>>() {}
			    );
			
			log.info("size {}",brands.size());
			
					
			for(PlatformBrandApiResDto dto : brands) {
											
				PlatformBrandEntity platformBrandEntity = new PlatformBrandEntity();
				platformBrandEntity.setCoId(env.getProperty("app.coid"));//회사id는 고정값
				platformBrandEntity.setBrandCode(dto.getBrandCode());
				platformBrandEntity.setStandardCatCode(dto.getStandardCategoryCode());
					
				platformBrandEntity.setBrandNameKor(dto.getBrandNames().getKoKr());
				platformBrandEntity.setBrandNameEn(dto.getBrandNames().getEnUs());
				platformBrandEntity.setBrandNameJp(dto.getBrandNames().getJaJp());
				platformBrandEntity.setBrandNameZhCn(dto.getBrandNames().getZhCn());
				platformBrandEntity.setBrandNameZhTw(dto.getBrandNames().getZhTw());													
				
				log.info("platformBrandEntity :{}", platformBrandEntity.toString());
				
				airstarBrandMapper.upsertPlatformBrand(platformBrandEntity);
			}			 
		}			
		
		//응답구조 정의 필요
		return res;	
	}
	
	//입점사 공항공사 브랜드 조회 API 연동                                                          
	public ResponseEntity<MiddlewareResDto<Map<String, Object>>> getPartnerBrands(HttpServletRequest req, Map<String,Object> param) throws Exception {			 
						
		String ifId = "CP205";
									
		//중계서버 요청에 필요한 정보 세팅 - url, method 등
		MiddlewareReqDto<Map<String, Object>> reqDto = middlewareApiManager.getInterfaceInfo(ifId);			
		
		reqDto.setParameter(param);//중계서버로 전송할 querystring이 있는 경우		
		
		log.info("[전송데이터]{}", reqDto.toString());
		ResponseEntity<MiddlewareResDto<Map<String, Object>>> res = middlewareApiManager.sendRequest(reqDto, new ParameterizedTypeReference<MiddlewareResDto<Map<String, Object>>>() {});
		
		//플랫폼 응답 코드 확인
		AirstarResCodeEnum resultCode = AirstarResCodeEnum.from(res.getBody().getCode());
		log.info("res.getBody().getCode() : {}, resultCode.isSuccess() : {}", res.getBody().getCode(), resultCode.isSuccess());
				
		if (resultCode.isSuccess()) {

			MiddlewareResDto<Map<String, Object>> resDto = (MiddlewareResDto<Map<String, Object>>)res.getBody();
			Map<String, Object> resMap = resDto.getData();
						
			Object brandsObj = resMap.get("brands");

			//json to object, 
			List<PartnerBrandApiResDto> brands = objectMapper.convertValue(
			        brandsObj,
			        new TypeReference<List<PartnerBrandApiResDto>>() {}
			    );
						
			log.info("응답 결과 행수 : {}", brands.size());
			
			for(PartnerBrandApiResDto dto : brands) {
				PartnerBrandEntity entity = new PartnerBrandEntity();
				entity.setSteId(dto.getBrandMid());
				entity.setUseYn(dto.getUseYn());
				entity.setBrandNameKor(dto.getBrandNames().getKoKr());
				entity.setBrandNameEn(dto.getBrandNames().getEnUs());
				entity.setBrandNameJp(dto.getBrandNames().getJaJp());				
				entity.setBrandNameZhCn(dto.getBrandNames().getZhCn());
				entity.setBrandNameZhTw(dto.getBrandNames().getZhTw());
				
				//입점사 브랜드 조회 api 응답은 brandMid, brandNames, useYn뿐임. 일단 해당 값만 update
				//매핑용도의 테이블?로 다른 컬럼은 필요없지 않나??
				//추후 배치에 의해 실행예정이며 응답 데이터에 있는 항목만 일단 업데이트 처리
				airstarBrandMapper.updatePartnerBrandBatch(entity);				
			} 			
		}		
				
		return res;				
	}
	
	//입점사 공항공사 브랜드 등록
	//자체 DB 저장 후 플랫폼 api 전송
	public ResponseEntity<MiddlewareResDto<Map<String, Object>>> registerPartnerBrands(HttpServletRequest req, Map<String, Object> reqData) throws Exception {			 
		
		String ifId = "CP204";//입점사 공항공사 브랜드 등록
									
		//중계서버 요청에 필요한 정보 세팅 - url, method 등
		MiddlewareReqDto<Map<String, Object>> reqDto = middlewareApiManager.getInterfaceInfo(ifId);
						
		//Map 형식 데이터 필요한 경우 추가 (body 등)		
		reqDto.setBody(reqData);//body data
		
		log.info("[전송데이터]{}", reqDto.toString());
		ResponseEntity<MiddlewareResDto<Map<String, Object>>> res = middlewareApiManager.sendRequest(reqDto, new ParameterizedTypeReference<MiddlewareResDto<Map<String, Object>>>() {});
		return res;				
	}
	
	//입점사 브랜드 저장 - db 저장 및 등록/수정 api 호출
	//db 트랜젝션과 api 요청 분리필요[TODO]
	@Transactional
	public void savePartenrBrands(List<PartnerBrandReqDto> partnerBrandReqList) throws Exception {										
		
		//플랫폼 API 요청에 전달 할 데이터
		List<PartnerBrandApiRegReqDto> regList = new ArrayList<>();//등록API 전달 리스트
		List<PartnerBrandApiRegReqDto> upList = new ArrayList<>();//수정API 전달 리스트
		
		//DB 저장
		for (PartnerBrandReqDto partnerBrand : partnerBrandReqList) {
		    
			//등록/수정 구분 C, U
			String status = partnerBrand.getStatus();
		  
		    // status에 따라 INSERT 또는 UPDATE 결정
		    if ("C".equals(status)) {
		    	airstarBrandMapper.insertPartnerBrand(partnerBrand);
		    	
		    	PartnerBrandApiRegReqDto regDto = new PartnerBrandApiRegReqDto();
		    	regDto.setBrandCode(partnerBrand.getBrandCode());
		    	regDto.setBrandMid(partnerBrand.getSteId());//사이트ID를 인천공사 brandMid로 사용
		    	regDto.setUseYn(partnerBrand.getUseYn());
		    	
		    	regList.add(regDto);		    	
		    	
		    } else if ("U".equals(status)) {        
		    	airstarBrandMapper.updatePartnerBrand(partnerBrand);
		    			    	
		    	PartnerBrandApiRegReqDto upDto = new PartnerBrandApiRegReqDto();
		    	upDto.setBrandCode(partnerBrand.getBrandCode());
		    	upDto.setBrandMid(partnerBrand.getSteId());//사이트ID를 인천공사 brandMid로 사용
		    	upDto.setUseYn(partnerBrand.getUseYn());
		    	
		    	upList.add(upDto);	
		    }	    
		}//for	
		
		log.info("입점사 파트너 브랜드 등록 건수 : {}", regList.size());
		log.info("입점사 파트너 브랜드 수정 건수 : {}", upList.size());
					
		//플랫폼 등록/수정 플랫폼 API요청
		if (!regList.isEmpty()) {
			
			String ifId = "CP204";//입점사 공항공사 브랜드 등록
			
			Map<String, Object> regReqData = new HashMap<>();
			regReqData.put("brands", regList);
			
			MiddlewareReqDto<Map<String, Object>> regReqDto = middlewareApiManager.getInterfaceInfo(ifId);
			regReqDto.setBody(regReqData);
			
			ResponseEntity<MiddlewareResDto<Map<String, Object>>> regRes = middlewareApiManager.sendRequest(regReqDto, new ParameterizedTypeReference<MiddlewareResDto<Map<String, Object>>>() {});	
			
			log.info("플랫폼 등록 결과 : {}", regRes.toString());
		}
		
		if (!upList.isEmpty()) {
			
			String ifId = "CP206";//입점사 공항공사 브랜드 등록
			
			Map<String, Object> upReqData = new HashMap<>();
			upReqData.put("brands", upList);
			
			MiddlewareReqDto<Map<String, Object>> upReqDto = middlewareApiManager.getInterfaceInfo(ifId);
			upReqDto.setBody(upReqData);
									
			ResponseEntity<MiddlewareResDto<Map<String, Object>>> upRes = middlewareApiManager.sendRequest(upReqDto, new ParameterizedTypeReference<MiddlewareResDto<Map<String, Object>>>() {});
			
			log.info("플랫폼 등록 결과 : {}", upRes.toString());
		}
	}
	
	
	/*플랫폼 브랜드 조회 결과 db 조회
	 * */
	public List<PlatformBrandEntity> selectPlatformBrands(HttpServletRequest req) throws Exception {		
		return airstarBrandMapper.selectPlatformBrands();		
	}
	
	
	/*입점사 브랜드 조회 결과 db 조회*/
	public List<PartnerBrandEntity> selectPartnerBrands(HttpServletRequest req) throws Exception {		
		return airstarBrandMapper.selectPartnerBrands();		
	}
	
	
	 	
}
