package com.cj.freshway.fs.cps.airstar.brand.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * @author 
 * @description
 *
 *              <pre>
 * Platform Brand 관리 
 *              </pre>
 */

@Data
public class PlatformBrandEntity {
	
	@Schema(description = "회사 ID")
	private String coId;
	
	@Schema(description = "브랜드 코드")
	private String brandCode;
	
	@Schema(description = "표준 카테고리 코드")
	private String standardCatCode;
	
	@Schema(description = "한국어 브랜드명")
	private String brandNameKor;
	
	@Schema(description = "영어 브랜드명")
	private String brandNameEn;
	
	@Schema(description = "일본어 브랜드명")
	private String brandNameJp;
	
	@Schema(description = "중국어 간체 브랜드명")
	private String brandNameZhCn;
	
	@Schema(description = "중국어 번체 브랜드명")
	private String brandNameZhTw;
}
