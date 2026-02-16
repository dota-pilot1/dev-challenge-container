package com.cj.freshway.fs.cps.airstar.middleware.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;


/**
 * @author choick
 * @description
 * 
 *              <pre>
 * Airstar 인터페이스를 위한 중계서버 응답 Dto
 *  - Airstar외 공통응답 규격을 따름
 *              </pre>
 */

@Data
public class MiddlewareResDto <T> {
	
	@Schema(description = "결과 코드")
	private String code;	
	
	@Schema(description = "결과 메세지")
	private String message;	
	
	@Schema(description = "결과 데이터")
	private T data;
	
	@Schema(description = "인터페이스 구분을 위한 키")
	private String requestId;
	
	@Schema(description = "실패 리소스")
	private Object resource;
}
