import axiosInstance from 'api/axios'

const API_DEFAULT = '/api/test/brandmng/'

const API_PLATFORM_BRAND_LIST = API_DEFAULT + 'v1.0/platformBrandList'
const API_SYNC_ICN_BRAND = API_DEFAULT + 'v1.0/syncIcnBrand'
const API_BRAND_LIST = API_DEFAULT + 'v1.0/brandList'
const API_BRAND_SAVE = API_DEFAULT + 'v1.0/saveBrand'

// 플랫폼 브랜드 목록 조회
export const fetchPlatformBrandList = (params) => {
  return axiosInstance
    .post(API_PLATFORM_BRAND_LIST, params)
    .then((response) => {
      const { data } = response.data
      return data
    })
    .catch((error) => {
      console.error('API error:', error)
      throw error
    })
}

// 인천공항 데이터 수신
export const fetchSyncIcnBrand = (params) => {
  return axiosInstance
    .post(API_SYNC_ICN_BRAND, params)
    .then((response) => {
      const { data } = response.data
      return data
    })
    .catch((error) => {
      console.error('API error:', error)
      throw error
    })
}

// 에어스타 브랜드 목록 조회
export const fetchBrandList = (params) => {
  return axiosInstance
    .post(API_BRAND_LIST, params)
    .then((response) => {
      const { data } = response.data
      return data
    })
    .catch((error) => {
      console.error('API error:', error)
      throw error
    })
}

// 에어스타 브랜드 저장
export const fetchSaveBrand = (params) => {
  return axiosInstance
    .post(API_BRAND_SAVE, params)
    .then((response) => {
      const { data } = response.data
      return data
    })
    .catch((error) => {
      console.error('API error:', error)
      throw error
    })
}
