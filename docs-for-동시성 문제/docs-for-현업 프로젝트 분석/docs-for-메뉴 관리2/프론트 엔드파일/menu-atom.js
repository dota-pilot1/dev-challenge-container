import { atom } from 'recoil'

//메뉴 스토리지 추가

/**
 * 메뉴 atom
 */
export const fwMenuState = atom({
  key: 'fwMenuStore',
  default: [
    {
      id: 0,
      menuName: '',
      depth: 0,
      active: false,
      subMenus: [],
    },
  ],
})

export const fwLeftMenuState = atom({
  key: 'fwLeftMenuStore',
  default: null,
})

export const fwLeftMenuOpenAtom = atom({
  key: 'fwLeftMenuOpenAtom',
  default: true,
})

export const fwLeftMenuNameAtom = atom({
  key: 'fwLeftMenuNameAtom',
  default: null,
})
