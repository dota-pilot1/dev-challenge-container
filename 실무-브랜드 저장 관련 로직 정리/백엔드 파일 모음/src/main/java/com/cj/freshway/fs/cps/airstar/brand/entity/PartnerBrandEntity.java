package com.cj.freshway.fs.cps.airstar.brand.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * @author 
 * @description
 *
 *              <pre>
 * 입점사 Brand 관리 
 *              </pre>
 */

@Data
public class PartnerBrandEntity {
	
	@Schema(description = "입점사 코드(CJ프레시웨이)")
	private String coId;
	
	@Schema(description = "플랫폼 브랜드 코드")
	private String brandCode;
	
	@Schema(description = "점포 ID")
	private String shopId;
	
	@Schema(description = "사이트 ID(brandMid)")
	private String steId;
	
	@Schema(description = "한국어 브랜드명")
	private String brandNameKor;
	
	@Schema(description = "영어 브랜드명")
	private String brandNameEn;
	
	@Schema(description = "일본어 브랜드명")
	private String brandNameJp;
	
	@Schema(description = "중국어(간체) 브랜드명")
	private String brandNameZhCn;
	
	@Schema(description = "중국어(번체) 브랜드명")
	private String brandNameZhTw;
	
	@Schema(description = "브랜드 설명")
	private String brandDesc;
	
	@Schema(description = "사용여부")
	private String useYn;
			
	@Schema(description = "등록자ID")
	private String regId;	
}
