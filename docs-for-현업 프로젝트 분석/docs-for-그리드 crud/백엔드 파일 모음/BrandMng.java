package com.cj.freshway.fs.test.brandmng;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class BrandMng {
	// 순번
	private String rowNum;
	// 회사코드
	private String coId;
	// 브랜드ID
	private String brandId;
	// 한국어 브랜드명
	private String brandNameKo;
	// 영어 브랜드명
	private String brandNameEn;
	// 일본어 브랜드명
	private String brandNameJp;
	// 중국어(간체) 브랜드명
	private String brandNameCnSimp;
	// 중국어(번체) 브랜드명
	private String brandNameCnTrad;
	// 브랜드 설명
	private String brandDesc;
	// 사용여부
	private String useYn;
	// 표준 카테고리 코드
	private String stdCategoryCd;
	// 등록자
	private String regrId;
	// 상태
	private String status = "R";

	@Schema(description = "브랜드 리스트")
	private List<BrandMng> brandList;
}
