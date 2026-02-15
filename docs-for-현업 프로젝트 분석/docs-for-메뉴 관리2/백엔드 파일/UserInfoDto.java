package com.cj.freshway.fs.cps.common.userInfo.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import lombok.ToString;

/**
 * @author MunYoungJun <yj.moon82@kt.com>
 * @description
 * 
 *              <pre>
 * 사용자 정보 Dto
 *              </pre>
 */
@Data
@ToString(callSuper = true)
public class UserInfoDto implements Serializable {
  /**
  * 
  */
  private static final long serialVersionUID = -1378813486010318053L;
  private String coId; // 회사ID
  private String userid; // 사용자ID
  private String username; // 사용자명
  private String empno; // 사번
  private String ccCd; // 점포ID
  private String orgId; // 지점ID
  private String divId; // 운영그룹ID
  private String slbzOrgId; // 본부코드

  List<ShopDto> shopList;
  List<SiteDto> siteList;
}
