package com.cj.freshway.fs.test.brandmng;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class BrandMngSearchDto {
	// 회사코드
	private String coId;
	// 사용자ID
	private String userid;
	// 브랜드ID
	private String brandId;
	// 사용여부
	private String useYn;
	// 등록자
	private String regrId;
}
