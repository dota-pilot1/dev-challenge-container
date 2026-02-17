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
 * 플랫폼 브랜드 조회 API 응답 수신용ㅓ DTO 
 *              </pre>
 */

@Data
@ToString(callSuper = true)
public class PlatformBrandApiResDto {
	
	@Schema(description = "플랫폼 브랜드 코드")
	private String brandCode;
	
	@Schema(description = "표준 카테고리")
	private String standardCategoryCode;
	
	@Schema(description = "브랜드명 다국어")
	private MultiLangNames brandNames;
}
