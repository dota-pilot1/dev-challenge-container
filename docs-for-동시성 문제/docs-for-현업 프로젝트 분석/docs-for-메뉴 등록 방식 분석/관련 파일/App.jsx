import axiosInstance from 'api/axios'
import 'assets/style/common.scss'
import 'assets/style/contents.scss'
import ContentsPage from 'components/common/layout/ContentsPage'
import CommonPopupArea from 'components/common/popup/CommonPopupArea'
import React, { useEffect } from 'react'
import './App.scss'
import { useNavigate } from 'react-router-dom'
import { fwMenuState } from 'store/atoms/layout/menu-atom'
import { useSetRecoilState } from 'recoil'
import { retryLazy } from 'lazyUtil'

export default function App() {
  const navigate = useNavigate()

  const setFwMenu = useSetRecoilState(fwMenuState)

  const preventClose = (e) => {
    navigate('/')
  }

  useEffect(() => {
    ; (() => {
      window.addEventListener('beforeunload', preventClose)
    })()

    return () => {
      window.removeEventListener('beforeunload', preventClose)
    }
  })

  useEffect(() => {
    const refresh = setInterval(() => {
      console.log('Process Token Refresh...')
      axiosInstance
        .get('/user/refreshToken', {
          headers: {
            refreshToken: sessionStorage.getItem('refreshToken'),
          },
        })
        .then((result) => {
          localStorage.setItem('accessToken', result.data.accessToken)
        })
        .catch((e) => {
          console.log("토큰 재발급 중 오류", e);
          clearInterval(refresh)
        })
      // }, 10 * 60 * 1000) //10분마다 토큰 Refresh
    }, 30 * 1000) //10분마다 토큰 Refresh -> 테스트용으로 확 쭐였음

    return () => {
      clearInterval(refresh)
    }
  }, [])

  const createMenuComponent = (menu) => {
    menu.comp = retryLazy(() => import(`./${menu.component}.jsx`))
    if (menu.subMenus != null) {
      for (let i = 0; i < menu.subMenus.length; i++) {
        createMenuComponent(menu.subMenus[i])
      }
    }
  }

  useEffect(() => {
    // 메뉴 localStroage get
    const list = localStorage.getItem('sessionMenuList')

    let getMenuList = JSON.parse(list)

    // 메뉴컴포넌트 셋팅
    for (let i = 0; i < getMenuList?.length; i++) {
      createMenuComponent(getMenuList[i])
    }

    setFwMenu(getMenuList)
  })

  return (
    <>
      <ContentsPage />
      <CommonPopupArea />
    </>
  )
}
