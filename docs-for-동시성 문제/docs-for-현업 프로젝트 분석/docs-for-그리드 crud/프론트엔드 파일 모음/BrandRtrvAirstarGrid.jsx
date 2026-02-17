import React, { forwardRef, useState } from 'react'
import SimpleTabulator from 'components/common/tabulator/SimpleTabulator'
import { rowColorChangeUtil } from 'utils/tabulator-util'
import 'assets/style/common.scss'
import 'assets/style/grid.scss'

export default forwardRef(function BrandRtrvAirstarGrid({ data, onSearch, onNew, onSave }, gridRef) {
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
      title: '브랜드 ID',
      field: 'brandId',
      sorter: 'string',
      hozAlign: 'center',
      width: 100,
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
      title: '브랜드 설명',
      field: 'brandDesc',
      sorter: 'string',
    },
    {
      title: '사용여부',
      field: 'useYn',
      sorter: 'string',
      hozAlign: 'center',
      width: 80,
      formatter: 'tickCross',
      formatterParams: { allowEmpty: false, allowTruthy: true, tickElement: 'Y', crossElement: 'N' },
    },
  ]

  return (
    <div className="component">
      <div className="title">
        <h3>에어스타 브랜드 관리</h3>
        <div>
          <button className="btn outline-button" type="button" onClick={onNew}>
            신규
          </button>
          <button className="btn outline-button" type="button" onClick={onSave}>
            저장
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
          id="airstarBrandGridRef"
          ref={gridRef}
          columns={columns}
          data={data}
          index="brandId"
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
