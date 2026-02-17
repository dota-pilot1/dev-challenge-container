package com.cj.freshway.fs.cps.airstar.brand.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.ToString;

/**
 * @author 
 * @description
 *
 *              <pre>
 * Partner Brand 등록/수정시 FE 요청 DTO   
 *              </pre>
 */

@Data
@ToString(callSuper = true)
public class PartnerBrandReqDto {
	
	@Schema(description = "입점사 코드(CJ프레시웨이)")
	private String coId;
	
	@Schema(description = "플랫폼 브랜드 코드")
	private String brandCode;
	
	@Schema(description = "점포 ID")
	private String shopId;
	
	@Schema(description = "사이트 ID(brandMid)")
	private String steId;
	
	@Schema(description = "한국어 브랜드명")
	private String brandNameKr;
	
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
	
	@Schema(description = "저장구분(U:수정, C:등록")
	private String status;
	
	@Schema(description = "등록자ID")
	private String regId;
}