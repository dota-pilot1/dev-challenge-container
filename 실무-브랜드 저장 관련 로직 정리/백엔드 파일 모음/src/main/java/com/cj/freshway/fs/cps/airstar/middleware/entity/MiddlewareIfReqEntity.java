package com.cj.freshway.fs.cps.airstar.middleware.entity;

import java.util.Map;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.ToString;


@Data
@ToString(callSuper = true)
public class MiddlewareIfReqEntity {
	
	  @Schema(description = "인터페이스 구분코드")
	  private String ifId;
	  
	  @Schema(description = "인터페이스 명칭")
	  private String ifName;

	  @Schema(description = "http method")
	  private String destinationMethod;
	  
	  @Schema(description = "목적지 Url")
	  private String destinationUrl;
	  
	  @Schema(description = "목적지 path")
	  private String destinationPath;
	
}
