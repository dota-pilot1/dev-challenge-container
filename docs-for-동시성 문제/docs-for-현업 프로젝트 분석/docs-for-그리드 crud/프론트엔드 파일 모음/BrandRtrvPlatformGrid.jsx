import React, { forwardRef, useState } from 'react'
import SimpleTabulator from 'components/common/tabulator/SimpleTabulator'
import { rowColorChangeUtil } from 'utils/tabulator-util'
import 'assets/style/common.scss'
import 'assets/style/grid.scss'

export default forwardRef(function BrandRtrvPlatformGrid({ data, onSearch, onSync }, gridRef) {
  const [totalCount, setTotalCount] = useState(0)

  const columns = [
    {
      title: 'No.',
      field: 'rowNum',
      formatter: 'rownum',
      width: 50,
      hozAlign: 'center',
    },
    {
      title: '인천공항 브랜드 ID',
      field: 'icnBrandId',
      sorter: 'string',
      hozAlign: 'center',
      width: 140,
    },
    {
      title: '한국어 브랜드명',
      field: 'brandNameKo',
      sorter: 'string',
    },
    {
      title: '영어 브랜드명',
      field: 'brandNameEn',
      sorter: 'string',
    },
    {
      title: '일본어 브랜드명',
      field: 'brandNameJp',
      sorter: 'string',
    },
    {
      title: '중국어(간체) 브랜드명',
      field: 'brandNameCnSimp',
      sorter: 'string',
    },
    {
      title: '중국어(번체) 브랜드명',
      field: 'brandNameCnTrad',
      sorter: 'string',
    },
    {
      title: '표준 카테고리 코드',
      field: 'stdCategoryCd',
      sorter: 'string',
      hozAlign: 'center',
      width: 140,
    },
  ]

  return (
    <div className="component">
      <div className="title">
        <h3>플랫폼 브랜드 관리</h3>
        <div>
          <button className="btn outline-button" type="button" onClick={onSync}>
            인천공항 데이터 수신
          </button>
          <button className="btn btn-gray" type="button" onClick={onSearch}>
            조회
          </button>
        </div>
      </div>
      <div className="grid">
        <div className="grid-title-total">
          <div className="grid-title">
            <strong>
              총 <span className="fw-bold">{totalCount}</span>건
            </strong>
          </div>
        </div>
        <SimpleTabulator
          id="platformBrandGridRef"
          ref={gridRef}
          columns={columns}
          data={data}
          index="icnBrandId"
          clipboard={true}
          visibleStatusName={false}
          columnHeaderVertAlign="bottom"
          placeholder="조회된 데이터가 없습니다."
          layout="fitColumns"
          events={{
            rowClick(e, row) {
              rowColorChangeUtil(row)
            },
            dataLoaded(data) {
              setTotalCount(data.length)
            },
          }}
        />
      </div>
    </div>
  )
})
