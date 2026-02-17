package com.cj.freshway.fs.cps.common.userInfo;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import com.cj.freshway.fs.common.base.GridResponse;
import com.cj.freshway.fs.common.jwt.JwtProvider;
import com.cj.freshway.fs.cps.common.userInfo.dto.AuthDto;
import com.cj.freshway.fs.cps.common.userInfo.dto.MenuDto;
import com.cj.freshway.fs.cps.common.userInfo.dto.ShopDto;
import com.cj.freshway.fs.cps.common.userInfo.dto.ShopSearchDto;
import com.cj.freshway.fs.cps.common.userInfo.dto.SiteDto;
import com.cj.freshway.fs.cps.common.userInfo.dto.UserInfoDto;
import com.cj.freshway.fs.cps.common.userInfo.entity.NotificationHist;
import com.cj.freshway.fs.cps.common.userInfo.exception.UserInfoFscpsException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 * 사용자 정보(메뉴, 권한, 정보) 서비스
 * </pre>
 *
 * @author MunYoungJun <yj.moon82@kt.com>
 */
@Slf4j
@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class UserInfoFscpsService {

  public static final String AUTHORIZATION_HEADER = "Authorization";
  public static final String BEARER_PREFIX = "Bearer ";

  @Autowired
  UserInfoFscpsMapper userInfoMapper;

  @Autowired
  JwtProvider jwtProvider;

  /**
   * <pre>
   * 메뉴 조회
   * </pre>
   *
   * @param userId
   * @return List<MenuDto>
   * @throws UserInfoFscpsException UserInfoException
   * @author MunYoungJun <yj.moon82@kt.com>
   */
  // @Cacheable(value = "selectMenuList", key = "#userId")
  public List<MenuDto> selectMenuList(String userId) throws UserInfoFscpsException {
    Map<String, Object> param = new HashMap<String, Object>();
    param.put("userId", userId);
    param.put("progLvl", 3);
    List<MenuDto> menuList = userInfoMapper.selectMenuList(param);
    for (MenuDto dto : menuList) {
      param = new HashMap<String, Object>();
      param.put("userId", userId);
      param.put("progLvl", 4);
      param.put("upProgNo", dto.getNo());
      List<MenuDto> menuSubList = userInfoMapper.selectMenuList(param);
      dto.setSubMenus(null);
      if (menuSubList.size() > 0) {
        dto.setSubMenus(menuSubList);
      }
      for (MenuDto sub : menuSubList) {
        param = new HashMap<String, Object>();
        param.put("userId", userId);
        param.put("progLvl", 5);
        param.put("upProgNo", sub.getNo());
        List<MenuDto> menuThirdList = userInfoMapper.selectMenuList(param);
        sub.setSubMenus(null);
        if (menuThirdList.size() > 0) {
          sub.setSubMenus(menuThirdList);
        }
      }

    }
    return menuList;
  }

  /**
   * <pre>
   * 권한 조회
   * </pre>
   *
   * @param userId
   * @return List<AuthDto>
   * @throws UserInfoFscpsException UserInfoException
   * @author MunYoungJun <yj.moon82@kt.com>
   */
  public List<AuthDto> selectAuthList(String userId) throws UserInfoFscpsException {
    return userInfoMapper.selectAuthList(userId);
  }

  /**
   * <pre>
   * 사용자 정보 조회
   * </pre>
   *
   * @param userId
   * @return UserInfoDto
   * @throws UserInfoFscpsException UserInfoException
   * @author MunYoungJun <yj.moon82@kt.com>
   */
  // @Cacheable(value = "selectUserInfo", key = "#userId")
  public UserInfoDto selectUserInfo(String userId) throws UserInfoFscpsException {
    UserInfoDto dto = userInfoMapper.selectUserInfo(userId);
    return dto;
  }

  /**
   * <pre>
   * 점포 조회
   * </pre>
   *
   * @param userId
   * @return List<ShopDto>
   * @throws UserInfoFscpsException UserInfoException
   * @author MunYoungJun <yj.moon82@kt.com>
   */
  // @Cacheable(value = "selectShopList", key = "#userId")
  public List<ShopDto> selectShopList(String userId) throws UserInfoFscpsException {
    return userInfoMapper.selectShopList(userId);
  }

  /**
   * <pre>
   * 알림 이력 조회
   * </pre>
   *
   * @param request HttpServletRequest
   * @return List<NotificationHist>
   * @throws UserInfoFscpsException userInfoException
   * @author MunYoungJun <yj.moon82@kt.com>
   */
  public List<NotificationHist> selectNotificationHistList(HttpServletRequest request,
      NotificationHist notificationHist) throws UserInfoFscpsException {
    String regrId = this.tokenUserId(request);

    notificationHist.setRecrId(regrId);

    return userInfoMapper.selectNotificationHistList(notificationHist);
  }

  /**
   * <pre>
   * 알림 이력 등록
   * </pre>
   *
   * @return seq
   * @throws UserInfoFscpsException userInfoException
   * @author MunYoungJun <yj.moon82@kt.com>
   */
  @Transactional
  public long insertNotificationHist(HttpServletRequest request, NotificationHist notificationHist)
      throws UserInfoFscpsException {

    long seq = userInfoMapper.selectNotificationSeq();
    String regrId = this.tokenUserId(request);

    notificationHist.setNtcnHstrySerno(seq);
    notificationHist.setRegrId(regrId);
    userInfoMapper.insertNotificationHist(notificationHist);

    return seq;

  }

  /**
   * <pre>
   * 알림 이력 수정
   * </pre>
   *
   * @return PopupMng
   * @throws UserInfoFscpsException userInfoException
   * @author MunYoungJun <yj.moon82@kt.com>
   */
  @Transactional
  public void updateNotificationHist(HttpServletRequest request, NotificationHist notificationHist)
      throws UserInfoFscpsException {

    String regrId = this.tokenUserId(request);
    notificationHist.setRecrId(regrId);
    userInfoMapper.updateNotificationHist(notificationHist);

  }

  /**
   * <pre>
   * 사이트 조회
   * </pre>
   *
   * @param userId
   * @return List<SiteDto>
   * @throws UserInfoFscpsException UserInfoException
   * @author MunYoungJun <yj.moon82@kt.com>
   */
  @Cacheable(value = "selectSiteList", key = "#userId")
  public List<SiteDto> selectSiteList(String userId) throws UserInfoFscpsException {
    return userInfoMapper.selectSiteList(userId);
  }

  /**
   * <pre>
   * 점포 조회(사용자 전환)
   * </pre>
   *
   * @return List<PopupMng>
   * @throws UserInfoFscpsException
   * @author MunYoungJun <yj.moon82@kt.com>
   */
  public GridResponse<Integer, Integer, Object> selectShopAllList(ShopSearchDto shopSearchDto)
      throws UserInfoFscpsException {

    // Integer count = userInfoMapper.selectShopAllListCount(shopSearchDto);

    List<ShopDto> selectShopAllList = userInfoMapper.selectShopAllList(shopSearchDto);

    Integer count = selectShopAllList.size();
    Double lastPage = Math.ceil((double) count / shopSearchDto.getSize());

    GridResponse<Integer, Integer, Object> response = new GridResponse<>();
    response.setLastRow(selectShopAllList.size());
    response.setLastPage(lastPage.intValue());
    response.setData(selectShopAllList);

    return response;

  }

  /**
   * <pre>
   * 토큰 정보 추출
   * </pre>
   *
   * @param HttpServletRequest req
   * @return String
   * @throws UserInfoFscpsException UserInfoException
   * @author MunYoungJun <yj.moon82@kt.com>
   */
  public String tokenUserId(HttpServletRequest req) throws UserInfoFscpsException {
    String accessToken = resolveToken(req);

    // 토큰 정보 추출
    String userId = jwtProvider.getTokenInfo(accessToken);

    return userId;
  }

  private String resolveToken(HttpServletRequest req) {
    String bearerToken = req.getHeader(AUTHORIZATION_HEADER);
    if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)) {
      return bearerToken.substring(7);
    }
    return null;
  }

}
