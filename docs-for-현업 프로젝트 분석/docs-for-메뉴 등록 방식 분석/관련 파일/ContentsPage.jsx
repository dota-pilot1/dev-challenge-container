import { useFwTab } from 'hooks/common/use-fw-tab'
import Header from 'components/common/layout/Header'
import LeftMenu from 'components/common/layout/LeftMenu'
import MdiTab from 'components/common/layout/MdiTab'
import HomeDboard from 'pages/cps/dboard/HomeDboard'
import ReactGA from 'react-ga4'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorPage from 'components/common/error/ErrorPage'

export default function ContentsPage() {
  const { tabs, currentTabIndex, fwLeftMenu, fwMenu } = useFwTab()

  return (
    <>
      <Header />
      <MdiTab />
      <div className={`section section-wrapper ${currentTabIndex === -1 ? 'dashboard' : ''}`}>
        {fwLeftMenu && <LeftMenu />}
        <div className="contents contents-wrapper fspay">
          {currentTabIndex === -1 ? (
            <div className={`contents-area dashboard ${currentTabIndex === -1 ? `show` : `hide`}`}>
              <HomeDboard />
            </div>
          ) : (
            ''
          )}
          {tabs &&
            tabs.map((tab) => (
              <div
                className={`contents-area ${currentTabIndex === tab.index ? `show` : `hide`}`}
                key={tab.id}
                /* CK목표진척율현황메뉴 선택할 경우만 오버플로우 적용 */
                style={{ overflowY: `${tabs[currentTabIndex]?.id !== '' ? `scroll` : ``}` }}
              >
                {/* 상위메뉴명 */}
                {currentTabIndex > -1 ? (
                  <div>
                    <h5>
                      {(fwMenu?.filter((m) => m.no === tabs[currentTabIndex].no.substring(0, 6)).length > 0) ? fwMenu?.filter((m) => m.no === tabs[currentTabIndex].no.substring(0, 6))[0].menuName : ''}
                      &nbsp;&gt;&nbsp;
                      {(fwLeftMenu?.subMenus.filter((lm) => lm.no === tabs[currentTabIndex].no.substring(0, 8)).length > 0)
                        ? fwLeftMenu?.subMenus.filter((lm) => lm.no === tabs[currentTabIndex].no.substring(0, 8))[0].menuName
                        : fwMenu?.filter((m) => m.no === tabs[currentTabIndex].no.substring(0, 6))[0]?.subMenus.filter((lm) => lm.no === tabs[currentTabIndex].no.substring(0, 8))[0].menuName
                      }
                    </h5>
                  </div>
                ) : (
                  ''
                )}
                {/* GA 페이지 뷰 전달 */}
                {process.env.REACT_APP_NODE_ENV === 'production' &&
                  ReactGA.send({ hitType: 'pageview', page: tab.componentName, title: tab.menuName })}
                <ErrorBoundary fallback={<ErrorPage />}>
                  <Suspense>
                    <tab.comp />
                  </Suspense>
                </ErrorBoundary>
                {/* {pageComponentList.filter((item) => item.componentName === tab.componentName)[0].component} */}
              </div>
            ))}
        </div>
      </div>
      {currentTabIndex != -1 && (
        <div className="location-bottom">
          {/* 탭 url 표기 */}

          <span>{tabs[currentTabIndex].id}</span>
          <div className="flex-wrap">
            <span>{tabs[currentTabIndex].component}</span>
            <span>[</span>
            <span>{tabs[currentTabIndex].menuName}</span>
            <span>]</span>
          </div>
        </div>
      )}
    </>
  )
}
