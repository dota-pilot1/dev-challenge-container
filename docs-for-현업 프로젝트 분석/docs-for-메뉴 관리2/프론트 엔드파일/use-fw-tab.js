import { useConfirm } from 'hooks/popup/use-common-popup'
import { isEmpty } from 'lodash'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { fwLeftMenuState, fwMenuState, fwLeftMenuOpenAtom, fwLeftMenuNameAtom } from 'store/atoms/layout/menu-atom'
import { currentTabIndexStore, tabStore, topLevelstore } from 'store/atoms/layout/tabs-atom'
import { getMessage } from 'utils/message-util'

/**
 * mdiTab 컴포넌트 공통 기능
 * @returns
 */
export const useFwTab = () => {
  const { confirm } = useConfirm()
  /**
   * 상단 GNB 메뉴의 인덱스 기본값 -1 은 아무 메뉴도 선택되지 않은 상태
   */
  const [topLevel, setTopLevel] = useRecoilState(topLevelstore)
  /**
   * mdiTab 컴포넌트에 표시될 메뉴 리스트
   */
  const [tabs, setTabs] = useRecoilState(tabStore)
  /**
   * 현재 포커싱 된 메뉴 인덱스
   */
  const [currentTabIndex, setCurrentTabIndex] = useRecoilState(currentTabIndexStore)
  /**
   * 상단 GNB 메뉴 리스트
   */
  const [fwMenu, setFwMenu] = useRecoilState(fwMenuState)
  /**
   * 좌측 서브 메뉴 리스트
   */
  const [fwLeftMenu, setFwLeftMenu] = useRecoilState(fwLeftMenuState)

  /**
   * 좌측 서브 메뉴 Open여부
   */
  const setFwLeftMenuOpen = useSetRecoilState(fwLeftMenuOpenAtom)

  /**
   * 메뉴이름 설정
   */
  const [fwMenuName, setFwMenuName] = useRecoilState(fwLeftMenuNameAtom)

  /**
   * 메뉴이름 set
   * @param {Sting} name 메뉴명
   */
  const handleSetMenuName = (name) => {
    //TAB수가 12개 미만일때만 메뉴이름 변경
    if (tabs.length < 12) {
      setFwMenuName(name)
    }
  }

  /**
   * 바로가기
   * @param {String} id 메뉴id
   */
  const handleShortcuts = (id) => {
    let tempId = id.substring(0, 16)
    setTopLevel(tempId)
    const currentMenu = fwMenu.map((m) => {
      let menu = { ...m, active: false }
      if (m.id === tempId) {
        menu.active = !menu.active
      }
      return menu
    })
    setFwMenu(currentMenu)
    setFwLeftMenuOpen(true)
    setFwLeftMenu(fwMenu.filter((m) => m.id === tempId)[0])
    handleActiveLeftMenu(id, fwMenu.filter((m) => m.id === tempId)[0])
  }

  /**
   * 상단 GNB 메뉴 클릭시 호출
   * @param {number} id GNB 메뉴 인덱스
   */
  const handleActive = (id) => {
    if (id < 0) return
    setTopLevel(id)
    const currentMenu = fwMenu.map((m) => {
      let menu = { ...m, active: false }
      if (m.id === id) {
        menu.active = !menu.active
      }
      return menu
    })
    setFwMenu(currentMenu)
    setFwLeftMenuOpen(true)
    //setFwLeftMenu(fwMenu.filter((m) => m.id === id)[0])
    const currentLeftSubMenu = fwMenu.filter((m) => m.id === id)[0].subMenus.map((sm) => {
      let subMenu = { ...sm, active: true }
      return subMenu
    })
    const currentLeftMenu = [fwMenu.filter((m) => m.id === id)[0]].map((m) => {
      let menu = { ...m, subMenus: currentLeftSubMenu }
      return menu
    })
    setFwLeftMenu(currentLeftMenu[0])
  }

  /**
   * 좌측 서브 메뉴 클릭시 호출
   * @param {number} id 서브 메뉴 인덱스
   */
  const handleActiveLeftMenu = (id, shortcuts) => {
    let tempFwLeftMenu
    if (!isEmpty(shortcuts)) {
      const currentLeftSubMenu = shortcuts.subMenus.map((sm) => {
        let subMenu = { ...sm, active: true }
        return subMenu
      })
      const currentLeftMenu = [shortcuts].map((m) => {
        let menu = { ...m, subMenus: currentLeftSubMenu }
        return menu
      })
      tempFwLeftMenu = currentLeftMenu[0]
    } else {
      tempFwLeftMenu = fwLeftMenu
    }
    const activeMenu = tempFwLeftMenu.subMenus.map((m) => {
      // let menu = { ...m, active: false }
      let menu = { ...m }
      let subMenus = ''
      if (menu.id === id) {
        menu.active = !menu.active
      }
      if (menu.subMenus) {
        subMenus = menu.subMenus.map((sm) => {
          let subMenu = ''
          if (sm.lastMenus) {
            sm.lastMenus.map((m) => {
              subMenu = { ...m, active: false }
              if (m.id === id) {
                subMenu.active = !subMenu.active
              }
            })
          } else {
            if (sm.id === id) {
              subMenu = { ...sm, active: true }
            } else {
              subMenu = { ...sm, active: false }
            }
          }
          return subMenu
        })
      }
      return { ...menu, subMenus: subMenus }
    })
    const newLeftMenu = { ...fwLeftMenu }
    newLeftMenu.subMenus = activeMenu

    setFwLeftMenu(newLeftMenu)
    if (!isEmpty(shortcuts)) {
      // 바로가기인 경우
      newLeftMenu?.subMenus.map((m) => {
        m.subMenus?.map((sm) => {
          if (sm.id === id && (sm.lastMenus === undefined || m.subMenus === null)) {
            handleAddTab(id, newLeftMenu)
            handleSetMenuName(sm.menuName)
          }
          sm.lastMenus?.map((mm) => {
            if (mm.id === id && (mm.lastMenus === undefined || mm.lastMenus === null)) {
              handleAddTab(id, newLeftMenu)
              handleSetMenuName(mm.menuName)
            }
          })
        })

        if (m.id === id && (m.subMenus === undefined || m.subMenus === null)) {
          handleAddTab(id, newLeftMenu)
          handleSetMenuName(m.menuName)
        }
      })
    } else {
      fwLeftMenu?.subMenus.map((m) => {
        m.subMenus?.map((sm) => {
          if (sm.id === id && (sm.lastMenus === undefined || m.subMenus === null)) {
            handleAddTab(id)
            handleSetMenuName(sm.menuName)
          }
          sm.lastMenus?.map((mm) => {
            if (mm.id === id && (mm.lastMenus === undefined || mm.lastMenus === null)) {
              handleAddTab(id)
              handleSetMenuName(mm.menuName)
            }
          })
        })

        if (m.id === id && (m.subMenus === undefined || m.subMenus === null)) {
          handleAddTab(id)
          handleSetMenuName(m.menuName)
        }
      })
    }
    // if (fwLeftMenu?.subMenus.filter((sm) => sm.id === id)[0]?.subMenus === undefined) {
    //   handleAddTab(id)
    // }
  }


  /**
   * 메뉴를 포함한 링크릴 대체할 함수
   * @param {number} id 메뉴 인덱스
   */
  const handleAddTab = (id, shortcuts) => {
    if (tabs.length === 12) {
      if (tabs.filter((t) => t.id === id).length > 0) {
        setCurrentTabIndex(tabs.filter((t) => t.id === id)[0].index)
        setFwMenuName(tabs.filter((t) => t.id === id)[0].menuName)
      } else {
        alert(getMessage('example_error_003'))
      }
      return null
    }

    let rtnMenu = {}
    let tempFwLeftMenu
    if (!isEmpty(shortcuts)) {
      // 바로가기인 경우
      tempFwLeftMenu = shortcuts
    } else {
      tempFwLeftMenu = fwLeftMenu
    }

    tempFwLeftMenu?.subMenus.map((m) => {
      if (m.subMenus) {
        m.subMenus.map((m) => {
          if (m.lastMenus) {
            m.lastMenus.map((m) => {
              if (m.id === id) {
                rtnMenu = {
                  parentId: topLevel,
                  id: m.id,
                  menuName: m.menuName,
                  componentName: m.componentName,
                  component: m.component,
                  comp: m.comp,
                  no: m.no,
                }
              }
            })
          } else {
            if (m.id === id) {
              rtnMenu = {
                parentId: topLevel,
                id: m.id,
                menuName: m.menuName,
                componentName: m.componentName,
                component: m.component,
                comp: m.comp,
                no: m.no,
              }
            }
          }
          return m
        })
      } else {
        if (m.id === id) {
          rtnMenu = {
            parentId: topLevel,
            id: m.id,
            menuName: m.menuName,
            componentName: m.componentName,
            component: m.component,
            comp: m.comp,
            no: m.no,
          }
        }
      }
      return m
    })

    const existMenu = tabs.filter((t) => t.id === id)
    if (existMenu.length > 0) {
      setCurrentTabIndex(existMenu[0].index)
    } else {
      const tabIndex = tabs.length
      const newTab = { ...rtnMenu }
      newTab.index = tabIndex

      // const newTabs = tabs.map((t) => {
      //   const newTabs = { ...t, active: false }
      //   return newTabs
      // })

      setTabs([...tabs, newTab])
      setCurrentTabIndex(tabIndex)
    }
  }

  /**
   * mdi에서 탭을 클릭시 호출
   * @param {number} index 탭의 인덱스
   */
  const handleChangeTab = (index, menuName) => {
    if (fwLeftMenu === null) {
      const { parentId } = tabs[index]
      handleActive(parentId)
    }
    setCurrentTabIndex(Number(index))
    setFwMenuName(menuName)
  }

  /**
   * mdi에서 탭의 닫기 아이콘 클릭시 호출
   * @param {number} index 탭의 인덱스
   */
  const handleCloseTab = (index, menuName) => {
    //tabs 리스트에서 닫히는 탭 데이터 삭제
    const newTabList = tabs.filter((t) => t.index !== index)

    if (newTabList.length === 0) {
      initMenu()
      initTabs()
      return
    }
    // tabs 리스트에서 닫히는 탭 데이터 삭제 후 인덱스 재정렬
    const newTabListWithIndexing = newTabList.map((t, i) => {
      return { ...t, index: i }
    })

    setTabs(newTabListWithIndexing)

    const { prevIndex, nextIndex, prevMenuName, nextMenuName } = getIndex(index)

    // 홈(-1)에서 탭을 닫았을때 인덱스 보정X(2024.12.20)
    if (currentTabIndex < 0) {
      return
    }

    //지워지는 탭 인덱스에 따라 현재 포커싱 탭 인덱스 보정
    if (currentTabIndex === index) {
      if (index !== 0) {
        setCurrentTabIndex(prevIndex)
        setFwMenuName(prevMenuName)
      } else {
        // 탭2개일때 첫번째 탭 삭제시 오류 수정
        if (tabs.length === 2) {
          setCurrentTabIndex(0)
        }
        setFwMenuName(nextMenuName)
      }
    } else {
      if (index < currentTabIndex) {
        setCurrentTabIndex((prev) => (prev - 1 > 0 ? prev - 1 : 0))
      }
    }
  }

  /**
   * 다음 탭으로 이동시 호출
   * @returns
   */
  const handleNextTab = () => {
    const { nextIndex, nextMenuName } = getIndex(currentTabIndex)
    if (tabs.length - 1 === currentTabIndex) {
      // alert('마지막 탭입니다.')
      return false
    }
    setCurrentTabIndex(nextIndex)
    arrangementLeftMenu(nextIndex)
    setFwMenuName(nextMenuName)
  }

  /**
   * 이전 탭으로 이동시 호출
   * @returns
   */
  const handlePrevTab = () => {
    const { prevIndex, prevMenuName } = getIndex(currentTabIndex)
    if (currentTabIndex === 0) {
      // alert('첫번째 탭입니다.')
      return false
    }
    if (prevIndex !== null) {
      setCurrentTabIndex(prevIndex)
      arrangementLeftMenu(prevIndex)
      setFwMenuName(prevMenuName)
    }
  }

  /**
   * 탭 전체 초기화 클릭시 호출
   */
  const handleClearTab = () => {
    if (tabs?.length > 0) {
      confirm('전체 탭을 닫으시겠습니까?', {
        okCallBack() {
          initMenu()
          initTabs()
        },
      })
    }
  }

  /**
   * mdi에서 HOME아이콘 클릭시 호출
   */
  const handleClickHome = () => {
    setTopLevel(-1)
    const currentMenu = fwMenu.map((m) => {
      let menu = { ...m, active: false }
      return menu
    })
    setFwMenu(currentMenu)
    setCurrentTabIndex(-1)
    setFwLeftMenu(null)
  }

  /**
   * [내부함수]
   * 해당 메뉴 인덱스로 이전 탭 인덱스와 다음 탭 인덱스를 리턴
   * @param {number} index
   * @returns
   */
  const getIndex = (index) => {
    const obj = tabs.filter((t) => t.index === index)[0]
    const currentIndex = tabs.indexOf(obj)

    const prevIndex = currentIndex - 1 >= 0 ? tabs[currentIndex - 1].index : null
    const nextIndex = tabs.length > currentIndex + 1 ? tabs[currentIndex + 1].index : null

    const prevMenuName = currentIndex - 1 >= 0 ? tabs[currentIndex - 1].menuName : null
    const nextMenuName = tabs.length > currentIndex + 1 ? tabs[currentIndex + 1].menuName : null

    return {
      prevIndex,
      currentIndex,
      nextIndex,
      prevMenuName,
      nextMenuName,
    }
  }

  /**
   * [내부함수]
   * 서브 메뉴 재정렬
   * @param {number} index
   */
  const arrangementLeftMenu = (index) => {
    if (topLevel !== tabs[index].parentId) handleActive(tabs[index].parentId)
  }

  /**
   * [내부함수]
   * 메뉴 초기화
   */
  const initMenu = () => {
    const currentMenu = fwMenu.map((m) => {
      let menu = { ...m, active: false }
      return menu
    })
    setFwMenu(currentMenu)
    setFwLeftMenu(null)
  }

  /**
   * [내부함수]
   * 탭 초기화
   */
  const initTabs = () => {
    setTabs([])
    setCurrentTabIndex(-1)
    setTopLevel(-1)
  }

  return {
    tabs,
    currentTabIndex,
    fwMenu,
    fwLeftMenu,
    fwMenuName,
    handleActive,
    handleActiveLeftMenu,
    handleAddTab,
    handleChangeTab,
    handleCloseTab,
    handleNextTab,
    handlePrevTab,
    handleClearTab,
    handleClickHome,
    handleShortcuts,
    handleSetMenuName,
  }
}
