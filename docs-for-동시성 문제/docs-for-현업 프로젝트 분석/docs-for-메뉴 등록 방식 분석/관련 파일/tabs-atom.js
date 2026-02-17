import { atom } from 'recoil'

/**
 * 탭에 추가되는 메뉴 데이터
 */
export const tabStore = atom({
  key: 'tabs',
  default: [],
})

/**
 * 현재 포커싱 된 탭 인덱스
 */
export const currentTabIndexStore = atom({
  key: 'currentTabIndex',
  default: -1,
})

export const topLevelstore = atom({
  key: 'topLevel',
  default: -1,
})
