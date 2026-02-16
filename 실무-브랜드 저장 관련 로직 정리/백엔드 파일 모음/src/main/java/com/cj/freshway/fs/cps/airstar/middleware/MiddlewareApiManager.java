package com.cj.freshway.fs.cps.airstar.middleware;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.cj.freshway.fs.common.base.BaseException;
import com.cj.freshway.fs.cps.airstar.middleware.dto.MiddlewareReqDto;
import com.cj.freshway.fs.cps.airstar.middleware.dto.MiddlewareResDto;
import com.cj.freshway.fs.cps.airstar.middleware.entity.MiddlewareIfReqEntity;

import lombok.extern.slf4j.Slf4j;


/**
 * @author System
 * @description
 *
 * <pre>
 * Airstar 인터페이스를 위한 중계서버 API 호출 공통
 * - 중계서버와의 규약에 따라 중계서버 Api 단일 EdnPoint를 호출
 * - BO -> 중계 -> Airstar API 로 요청하여 응답을 수신 
 *  
 * </pre>
 */
@Slf4j
@Component
public class MiddlewareApiManager {
	
	@Autowired
	AirstarInterfaceInfoMapper airstarInterfaceInfoMapper;
	
	@Autowired
	private RestTemplate restTemplate;
		
	@Value("${middleware.base-url}")
	private String middlewareBaseUrl;	
		
	/**
	   * 요청 전송 공통
	   *
	   * @param MiddlewareReqDto<REQ>
	   * @param ParameterizedTypeReference<MiddlewareResDto<RES>>
	   * @param 
	   * @return 
	   * @throws 
	   */
	public <REQ, RES>ResponseEntity<MiddlewareResDto<RES>> sendRequest(MiddlewareReqDto<REQ> reqDto, ParameterizedTypeReference<MiddlewareResDto<RES>> responseType) throws Exception {
		
		log.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>중계서버로 API요청 시작<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
		log.info("middlewareBaseUrl : {}", middlewareBaseUrl);
		log.info("중계 요청 데이터 : {}", reqDto);
				
		HttpHeaders httpHeaders = new HttpHeaders();
	    httpHeaders.setContentType(MediaType.APPLICATION_JSON);
	    
	    //현재 중계서버에서 아래 헤더들이 필수 -> 인터셉터에서 체크함. 현재는 임시로 임의값 전송중 [TODO]
	    //1) 요청하는 쪽에서 임의값을 그냥 보낼 것인가
	    //2) 수신하는 중계서버에서 해당 경로를 제외 시킬것인가
	    httpHeaders.set("INTERFACE_ID", "IF0004");
	    httpHeaders.set("INTERFACE_AUTH_KEY", "sclwEZRE/XQnc4kwlK3HUV9nBMAws0I8r1d8IWAsJUE=");
	    httpHeaders.set("INTERFACE_REQ_DT", "20221017172212");
	    httpHeaders.set("INTERFACE_TRACEKEY", "1000000000000000000");
	    
	    //요청정보 개체ㄹ
		HttpEntity<MiddlewareReqDto<REQ>> requestEntity = new HttpEntity<>(reqDto, httpHeaders);

		//요청 전송
		ResponseEntity<MiddlewareResDto<RES>> response = restTemplate.exchange(
																middlewareBaseUrl,
																HttpMethod.POST, 
																requestEntity, 
																responseType
																);
		
		log.info(">>>>>>>응답 상태코드 : {}", response.getStatusCode());
		log.info(">>>>>>>응답 code: {}", response.getBody().getCode());
		log.info(">>>>>>>응답 message: {}", response.getBody().getMessage());		
		log.info(">>>>>>>응답 body: {}", response.getBody().getData());
		log.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>중계서버로 API요청 종료<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");		
		
		return response;
	}
	
	/*해당 ifId에 대한 기본정보 db조회하여 반환 */
	public <REQ> MiddlewareReqDto<REQ> getInterfaceInfo(String ifId) throws Exception  {	
		
		MiddlewareIfReqEntity ifInfoDto = airstarInterfaceInfoMapper.getAirstarInterfaceInfo(ifId);
		log.info("ifInfo >>>> {}", ifInfoDto);
		
		MiddlewareReqDto<REQ> reqDto = new MiddlewareReqDto<>();
		reqDto.setDestination_method(ifInfoDto.getDestinationMethod());
		reqDto.setDestination_url(ifInfoDto.getDestinationUrl());
		reqDto.setDestination_path(ifInfoDto.getDestinationPath());		
		
		return reqDto;
	}
	
}