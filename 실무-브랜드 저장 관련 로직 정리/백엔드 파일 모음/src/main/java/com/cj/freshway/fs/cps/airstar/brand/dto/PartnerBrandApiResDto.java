package com.cj.freshway.fs.cps.airstar.brand.dto;

import com.cj.freshway.fs.cps.airstar.common.dto.MultiLangNames;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.ToString;

/**
 * @author 
 * @description
 *
 *              <pre>
 * 입점사 브랜드 조회 API 응답 수신용 DTO 
 *              </pre>
 */

@Data
public class PartnerBrandApiResDto {
	
	@Schema(description = "입점사 브랜드 코드(플랫폼 brandCode와 매핑)")
	private String brandMid;
	
	@Schema(description = "사용여부")
	private String useYn;
	
	@Schema(description = "브랜드명(다국어)")
	private MultiLangNames brandNames;
}
