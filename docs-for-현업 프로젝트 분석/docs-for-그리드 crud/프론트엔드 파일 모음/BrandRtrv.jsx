import React, { useRef, useState } from 'react'
import BrandRtrvPlatformGrid from 'components/cps/base/brandmng/BrandRtrvPlatformGrid'
import BrandRtrvAirstarGrid from 'components/cps/base/brandmng/BrandRtrvAirstarGrid'
import 'assets/style/common.scss'
import 'assets/style/contents.scss'
import 'assets/style/grid.scss'

const BrandRtrv = () => {
  const [platformList, setPlatformList] = useState([])
  const [airstarList, setAirstarList] = useState([])
  const platformGridRef = useRef(null)
  const airstarGridRef = useRef(null)

  // 플랫폼 브랜드 조회
  const handlePlatformSearch = () => {
    // TODO: API 연동 시 fetchPlatformBrandList 호출
    setPlatformList([
      { icnBrandId: 'ICN001', brandNameKo: 'CJ푸드빌', brandNameEn: 'CJ Foodville', brandNameJp: 'CJフードビル', brandNameCnSimp: 'CJ餐饮', brandNameCnTrad: 'CJ餐飲', stdCategoryCd: 'STD01' },
      { icnBrandId: 'ICN002', brandNameKo: '빕스', brandNameEn: 'VIPS', brandNameJp: 'ビップス', brandNameCnSimp: 'VIPS', brandNameCnTrad: 'VIPS', stdCategoryCd: 'STD02' },
      { icnBrandId: 'ICN003', brandNameKo: '뚜레쥬르', brandNameEn: 'Tous Les Jours', brandNameJp: 'トゥレジュール', brandNameCnSimp: '多乐之日', brandNameCnTrad: '多樂之日', stdCategoryCd: 'STD03' },
    ])
  }

  // 인천공항 데이터 수신
  const handleSync = () => {
    // TODO: API 연동 시 fetchSyncIcnBrand 호출
    console.log('인천공항 데이터 수신')
    handlePlatformSearch()
  }

  // 에어스타 브랜드 조회
  const handleAirstarSearch = () => {
    // TODO: API 연동 시 fetchBrandList 호출
    setAirstarList([
      { brandId: 'BR001', icnBrandId: 'ICN001', brandNameKo: 'CJ푸드빌', brandNameEn: 'CJ Foodville', brandNameJp: 'CJフードビル', brandNameCnSimp: 'CJ餐饮', brandNameCnTrad: 'CJ餐飲', brandDesc: 'CJ푸드빌 브랜드', useYn: 'Y' },
      { brandId: 'BR002', icnBrandId: 'ICN002', brandNameKo: '빕스', brandNameEn: 'VIPS', brandNameJp: 'ビップス', brandNameCnSimp: 'VIPS', brandNameCnTrad: 'VIPS', brandDesc: '빕스 브랜드', useYn: 'Y' },
      { brandId: 'BR003', icnBrandId: 'ICN003', brandNameKo: '뚜레쥬르', brandNameEn: 'Tous Les Jours', brandNameJp: 'トゥレジュール', brandNameCnSimp: '多乐之日', brandNameCnTrad: '多樂之日', brandDesc: '뚜레쥬르 브랜드', useYn: 'N' },
    ])
  }

  // 에어스타 신규
  const handleAirstarNew = () => {
    setAirstarList((prev) => [
      ...prev,
      { brandId: '', icnBrandId: '', brandNameKo: '', brandNameEn: '', brandNameJp: '', brandNameCnSimp: '', brandNameCnTrad: '', brandDesc: '', useYn: 'Y', _flag: 'I' },
    ])
  }

  // 에어스타 저장
  const handleAirstarSave = () => {
    // TODO: API 연동 시 fetchSaveBrand 호출
    console.log('저장 데이터:', airstarList)
  }

  return (
    <>
      <BrandRtrvPlatformGrid
        ref={platformGridRef}
        data={platformList}
        onSearch={handlePlatformSearch}
        onSync={handleSync}
      />
      <BrandRtrvAirstarGrid
        ref={airstarGridRef}
        data={airstarList}
        onSearch={handleAirstarSearch}
        onNew={handleAirstarNew}
        onSave={handleAirstarSave}
      />
    </>
  )
}

export default React.memo(BrandRtrv)
