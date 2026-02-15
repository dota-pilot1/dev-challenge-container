import { useFwTab } from 'hooks/common/use-fw-tab'
import 'assets/style/common.scss'
import search from 'assets/images/search.svg'
import { useState } from 'react'
import { useRecoilState } from 'recoil'
import { fwLeftMenuOpenAtom } from 'store/atoms/layout/menu-atom'
import { tabStore, currentTabIndexStore } from 'store/atoms/layout/tabs-atom'
import { retryLazy } from 'lazyUtil'

const styles = {
  position: 'fixed',
  border: '1px solid #e1e1e1',
  width: '30px',
  height: '70px',
  top: '300px',
  textAlign: 'center',
  lineHeight: '27px',
}
const devMenuList = [
  {
    id: 'IPIC-COM-FS-12010803',
    menuName: '브랜드 조회',
    componentName: 'BrandRtrv',
    component: 'pages/cps/base/brandmng/BrandRtrv',
    no: '0712010803',
    comp: retryLazy(() => import('pages/cps/base/brandmng/BrandRtrv')),
  },
  {
    id: 'IPIC-COM-FS-12010804',
    menuName: '매장 마스터 관리',
    componentName: 'ShopMstrMng',
    component: 'pages/cps/base/shopmng/ShopMstrMng',
    no: '0712010804',
    comp: retryLazy(() => import('pages/cps/base/shopmng/ShopMstrMng')),
  },
  {
    id: 'IPIC-COM-FS-12010805',
    menuName: '매장 전시 카테고리 관리',
    componentName: 'ShopDspCtgMng',
    component: 'pages/cps/base/shopdspctg/ShopDspCtgMng',
    no: '0712010805',
    comp: retryLazy(() => import('pages/cps/base/shopdspctg/ShopDspCtgMng')),
  },
]

export default function LeftMenu() {
  const { fwLeftMenu, handleActiveLeftMenu } = useFwTab()
  const [fwLeftMenuOpen, setFwLeftMenuOpen] = useRecoilState(fwLeftMenuOpenAtom)
  const [tabs, setTabs] = useRecoilState(tabStore)
  const [currentTabIndex, setCurrentTabIndex] = useRecoilState(currentTabIndexStore)

  const toggleClick = () => {
    setFwLeftMenuOpen(!fwLeftMenuOpen)
  }

  const handleDevMenuClick = (menu) => {
    const existTab = tabs.filter((t) => t.id === menu.id)
    if (existTab.length > 0) {
      setCurrentTabIndex(existTab[0].index)
      return
    }
    if (tabs.length === 12) {
      alert('탭은 최대 12개까지 열 수 있습니다.')
      return
    }
    const tabIndex = tabs.length
    const newTab = { ...menu, index: tabIndex, parentId: -1 }
    setTabs([...tabs, newTab])
    setCurrentTabIndex(tabIndex)
  }
  return (
    <>
      <div className={`left-menu ${fwLeftMenuOpen ? '' : 'toggled'}`}>
        <div className="btn-toggle" onClick={toggleClick}>
          <span>{fwLeftMenuOpen ? '<' : '>'}</span>
        </div>
        <div className="left-top-title">
          {/* 프로그램 검색 제거 2023.06.21 */}
          {/* <div className="search-input-area">
            <input placeholder="프로그램 검색" className="search-input" />
            <button id="search-button" className="search-button">
              <img src={search} alt="검색버튼"></img>
            </button>
          </div> */}
          <h2>{fwLeftMenu.menuName}</h2>
        </div>
        {/* 7/10 사용 안함으로 탭 주석처리 */}
        {/* <div className="nav-tab">
          <span className="tab active">기본메뉴</span>
          <span className="tab">최근접속메뉴</span>
        </div> */}
        <div className="left-menu-wrap">
          {fwLeftMenu.subMenus &&
            fwLeftMenu.subMenus.map((item) => (
              <ul className="left-menu-1depth" key={item.id}>
                <li>
                  <button
                    className={`title-1depth ${item.active ? 'active' : ''}`}
                    onClick={() => handleActiveLeftMenu(item.id)}
                  >
                    {item.menuName}
                  </button>
                </li>
                <li>
                  <ul className="left-menu-2depth">
                    {item.subMenus &&
                      item.subMenus.map((subItem) => (
                        <li className={`left-menu-2depth-li ${item.active ? 'active' : 'hide'}`} key={subItem.id}>
                          <button
                            className={`title-2depth ${subItem.active ? 'active' : ''}`}
                            onClick={() => handleActiveLeftMenu(subItem.id)}
                          >
                            {subItem.menuName}
                          </button>
                          {subItem.lastMenus &&
                            subItem.lastMenus.map((lastItem) => (
                              <li className="left-menu-2depth-li" key={lastItem.id}>
                                <button
                                  className={`title-2depth ${lastItem.active ? 'active' : ''}`}
                                  onClick={() => handleActiveLeftMenu(lastItem.id)}
                                >
                                  {lastItem.menuName}
                                </button>
                              </li>
                            ))}
                        </li>
                      ))}
                  </ul>
                </li>
              </ul>
            ))}
        </div>
        {/* 하드코딩 개발 메뉴 */}
        <div className="left-menu-wrap" style={{ borderTop: '1px solid #e1e1e1', marginTop: '10px', paddingTop: '10px' }}>
          <ul className="left-menu-1depth">
            <li>
              <button className="title-1depth active" style={{ cursor: 'default', fontWeight: 'bold' }}>
                인천공항 기준정보관리
              </button>
            </li>
            <li>
              <ul className="left-menu-2depth">
                {devMenuList.map((menu) => (
                  <li className="left-menu-2depth-li active" key={menu.id}>
                    <button
                      className="title-2depth"
                      onClick={() => handleDevMenuClick(menu)}
                    >
                      {menu.menuName}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
