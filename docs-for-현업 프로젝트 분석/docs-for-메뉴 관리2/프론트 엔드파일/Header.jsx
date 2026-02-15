import React, { useState } from 'react'
import { useFwTab } from 'hooks/common/use-fw-tab'
import { getUserInfoFromSessionStorage } from 'utils/user-info-storage-util'
import UserChangePopup from 'pages/userchange/UserChangePopup'
import { useRecoilState } from 'recoil'
import { fwLeftMenuOpenAtom } from 'store/atoms/layout/menu-atom'

export default function Header() {
  const { fwMenu, handleActive, handleClickHome } = useFwTab()
  const [fwLeftMenuOpen, setFwLeftMenuOpen] = useRecoilState(fwLeftMenuOpenAtom)
  const [popupOpen, setPopupOpen] = useState(false)

  const handleOpClPopup = (boolean) => {
    setPopupOpen(boolean)
  }
  const toggleClick = () => {
    setFwLeftMenuOpen(!fwLeftMenuOpen)
  }

  // 메뉴 예제 제외
  const settingMenu = (val) => {
    if (process.env.REACT_APP_NODE_ENV === 'production' || process.env.REACT_APP_NODE_ENV === 'qa') {
      if (String(val?.id)?.substring(12, 16) !== '1299') return val?.menuName
    } else {
      return val?.menuName
    }
  }

  // 실행시스템
  const execName = () => {
    if (process.env.REACT_APP_NAME === 'FSCPS') {
      return 'FS통합결제'
    } else {
      return 'FS메뉴'
    }
  }

  // 실행환경
  const envName = () => {
    if (process.env.REACT_APP_NODE_ENV === 'production') {
    } else {
      return process.env.REACT_APP_NODE_ENV.toUpperCase()
    }
  }

  return (
    <>
      <div className="header">
        <div className="header-first-line">
          <div className="header-menu">
            <h1 className="logo" onClick={handleClickHome} style={{ marginLeft: '24px', cursor: 'pointer' }}>
              CJ FRESHWAY
              <span>{execName()}</span>
              <span style={{color: '#ffff00'}}>{envName()}</span>
            </h1>
            <ul className="header-1depth">
              {fwMenu?.map((item) => (
                <li key={item.id}>
                  <button className={`btn-text ${item.active ? 'active' : ''}`} onClick={() => handleActive(item.id)}>
                    {settingMenu(item)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="nav-right-menu">
            <p className="user-name">
              {getUserInfoFromSessionStorage().username}
              <span className="ps-2 ml8">환영합니다.</span>
            </p>
            {/* <button className="btn" onClick={() => handleOpClPopup(true)}>
              사용자 전환
            </button> */}
          </div>
        </div>
      </div>
      {popupOpen && <UserChangePopup onClose={handleOpClPopup} />}
    </>
  )
}