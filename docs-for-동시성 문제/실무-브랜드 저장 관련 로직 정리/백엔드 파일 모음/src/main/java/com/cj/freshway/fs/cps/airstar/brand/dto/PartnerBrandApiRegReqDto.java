package com.cj.freshway.fs.cps.airstar.brand.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.ToString;

/**
 * @author 
 * @description
 *
 *              <pre>
 * Partner Brand Airstar Platfor 등록/수정 api용 Dto 
 *              </pre>
 */

@Data
@ToString(callSuper = true)
public class PartnerBrandApiRegReqDto {
	
	@Schema(description = "입점사의 브랜드 식별자")
	private String brandMid;
	
	@Schema(description = "플랫폼 브랜드 코드")
	private String brandCode;
	
	@Schema(description = "사용여부")
	private String useYn;
}
