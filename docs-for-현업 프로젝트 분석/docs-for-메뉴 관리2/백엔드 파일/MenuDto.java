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
 * 메뉴 Dto
 *              </pre>
 */
@Data
@ToString(callSuper = true)
public class MenuDto implements Serializable {

  /**
   * 
   */
  private static final long serialVersionUID = 7111086575907023057L;
  // private String progCd;
  // private String name;
  // private String no;
  // private int progLvl;
  // private String url;
  //
  // public MenuDto(String progCd, String name, String no, int progLvl, String url) {
  // this.progCd = progCd;
  // this.name = name;
  // this.no = no;
  // this.progLvl = progLvl;
  // this.url = url;
  // }


  private String id;
  private String menuName;
  private int depth;
  boolean active;
  private String no;
  private String componentName;
  private String component;
  private List<MenuDto> subMenus;

  // public MenuDto(String id, String menuName, int depth, boolean active, String no, String parent,
  // String componentName) {
  // this.id = id;
  // this.menuName = menuName;
  // this.depth = depth;
  // this.active = active;
  // this.no = no;
  // this.parent = parent;
  // this.componentName = componentName;
  // }

}
