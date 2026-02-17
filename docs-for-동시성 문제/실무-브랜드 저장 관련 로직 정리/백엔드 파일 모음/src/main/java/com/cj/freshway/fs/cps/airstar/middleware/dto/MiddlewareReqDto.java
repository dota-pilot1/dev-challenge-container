package com.cj.freshway.fs.cps.airstar.middleware.dto;

import java.util.Map;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.ToString;

/**
 * @author choick
 * @description
 * 
 *              <pre>
 * Airstar 인터페이스를 위한 중계서버 요청 Dto
 *              </pre>
 */
@Data
public class MiddlewareReqDto<T> {
	
	@Schema(description = "목적지 url")
	private String destination_url;	
	
	@Schema(description = "목적지 path")
	private String destination_path;	
	
	@Schema(description = "목적지 http method")
	private String destination_method;
	
	@Schema(description = "목적지 경로변수 치환용 데이터")
	private Map<String, Object> path_variable;
	
	@Schema(description = "목적지 GET parameters")
	private Map<String, Object> parameter;
	
	@Schema(description = "목적지 header 추가용")
	private Map<String, Object> header;
	
	@Schema(description = "body 테디터")
	private T body;
	
}
