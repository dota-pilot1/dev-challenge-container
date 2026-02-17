package com.cj.freshway.fs.cps.common.userInfo;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Mapper;
import com.cj.freshway.fs.cps.common.userInfo.dto.AuthDto;
import com.cj.freshway.fs.cps.common.userInfo.dto.MenuDto;
import com.cj.freshway.fs.cps.common.userInfo.dto.ShopDto;
import com.cj.freshway.fs.cps.common.userInfo.dto.ShopSearchDto;
import com.cj.freshway.fs.cps.common.userInfo.dto.SiteDto;
import com.cj.freshway.fs.cps.common.userInfo.dto.UserInfoDto;
import com.cj.freshway.fs.cps.common.userInfo.entity.NotificationHist;
import com.cj.freshway.fs.cps.common.userInfo.exception.UserInfoFscpsException;

/**
 * 
 * <pre>
 * 사용자 정보(메뉴, 권한, 정보) mapper
 * </pre>
 *
 * @author MunYoungJun <yj.moon82@kt.com>
 */
@Mapper
public interface UserInfoFscpsMapper {

  /**
   * <pre>
   * 메뉴 조회
   * </pre>
   *
   * @param Map<String,Object>
   * @return List<MenuDto>
   * @throws UserInfoFscpsException UserInfoException
   * @author MunYoungJun <yj.moon82@kt.com>
   */
  public List<MenuDto> selectMenuList(Map<String, Object> paramMap) throws UserInfoFscpsException;

  /**
   * <pre>
   * 권한 조회
   * </pre>
   *
   * @param userId
   * @return List<AuthDto>
   * @throws UserInfoFscpsException
   * @author MunYoungJun <yj.moon82@kt.com>
   */
  public List<AuthDto> selectAuthList(String userId) throws UserInfoFscpsException;

  /**
   * <pre>
   * 사용자 정보 조회
   * </pre>
   *
   * @param userId
   * @return UserInfoDto
   * @throws UserInfoFscpsException
   * @author MunYoungJun <yj.moon82@kt.com>
   */
  public UserInfoDto selectUserInfo(String userId) throws UserInfoFscpsException;

  /**
   * <pre>
   * 점포 조회
   * </pre>
   *
   * @param userId
   * @return List<ShopDto>
   * @throws UserInfoFscpsException
   * @author MunYoungJun <yj.moon82@kt.com>
   */
  public List<ShopDto> selectShopList(String userId) throws UserInfoFscpsException;

  /**
   * <pre>
   * 사이트 조회
   * </pre>
   *
   * @param userId
   * @return List<SiteDto>
   * @throws UserInfoFscpsException
   * @author MunYoungJun <yj.moon82@kt.com>
   */
  public List<SiteDto> selectSiteList(String userId) throws UserInfoFscpsException;

  /**
   * <pre>
   * 점포 조회(사용자 전환)
   * </pre>
   *
   * @return List<PopupMng>
   * @throws UserInfoFscpsException
   * @author MunYoungJun <yj.moon82@kt.com>
   */
  public List<ShopDto> selectShopAllList(ShopSearchDto shopSearchDto) throws UserInfoFscpsException;

  /**
   * <pre>
   * 점포 조회(사용자 전환) count 수 조회
   * </pre>
   *
   * @return List<PopupMng>
   * @throws UserInfoFscpsException
   * @author MunYoungJun <yj.moon82@kt.com>
   */
  public Integer selectShopAllListCount(ShopSearchDto shopSearchDto) throws UserInfoFscpsException;

  /**
   * <pre>
   * 알림 이력 조회
   * </pre>
   *
   * @param request HttpServletRequest
   * @return List<NotificationHist>
   * @throws UserInfoFscpsException
   * @author MunYoungJun <yj.moon82@kt.com>
   */
  public List<NotificationHist> selectNotificationHistList(NotificationHist notificationHist)
      throws UserInfoFscpsException;

  /**
   * <pre>
   * 알림 이력 조회
   * </pre>
   *
   * @return long
   * @throws UserInfoFscpsException
   * @author MunYoungJun <yj.moon82@kt.com>
   */
  public long selectNotificationSeq() throws UserInfoFscpsException;

  /**
   * <pre>
   * 알림 이력 등록
   * </pre>
   *
   * @return void
   * @throws UserInfoFscpsException
   * @author MunYoungJun <yj.moon82@kt.com>
   */
  public void insertNotificationHist(NotificationHist notificationHist)
      throws UserInfoFscpsException;

  /**
   * <pre>
   * 알림 이력 수정
   * </pre>
   *
   * @return void
   * @throws UserInfoFscpsException
   * @author MunYoungJun <yj.moon82@kt.com>
   */
  public void updateNotificationHist(NotificationHist notificationHist)
      throws UserInfoFscpsException;

}
