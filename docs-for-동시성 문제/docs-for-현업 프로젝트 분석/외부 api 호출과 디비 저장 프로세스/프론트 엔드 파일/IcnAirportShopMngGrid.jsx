import React, { forwardRef, useEffect, useRef, useState } from 'react'
import SimpleTabulator from 'components/common/tabulator/SimpleTabulator'
import { numberFormatter } from 'utils/formatter-util'
import { useTabulator } from 'hooks/common/use-tabulator'
import { API_ICN_AIRPORT_SHOP_DETEIL } from 'api/cps/base/icnairportmng/icnairportshopmng-fetch'
import { useCommonApiQuery } from 'hooks/common/use-common-api-query'
import { get } from 'lodash'
import { nullToStr } from 'utils/string-util'
import { rowColorChangeUtil } from 'utils/tabulator-util'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useAlert, useConfirm } from 'hooks/popup/use-common-popup'
import { icnAirportShopMngDetailAtom } from 'store/atoms/cps/base/icnairportmng/icnairportshopmng-atom'
import useDidMountEffect from 'pages/common/customHooks/CustomHooks'
import { v4 as uuid } from 'uuid'
import 'assets/style/common.scss'
import 'assets/style/grid.scss'

/**
 * @author doojin.lee
 * @date 2024.07.15
 * @description 인천공항 매장관리 그리드
 * @returns
 */

const IcnAirportShopMngGrid = (props) => {

  const [totalCount, setTotalCount] = useState(0)

  const { register, reset, control, watch, getValues, setValue } = props.searchUseForm
  // const [searchParams, setSearchParams] = useState(null)	
  const [searchParams, setSearchParams] = useState({})
  const [compSearchParams, setCompSearchParams] = useState({})
  const [oldRow, setOldRow] = useState(0)
  const icnAirportShopMngGridRef = useRef(null)
  const { alert } = useAlert()
  const { confirm } = useConfirm()
  const [loading, setLoading] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)

  const {
    selectedRows,
    deleteRows,
    resetEditedRows,
    createRow,
    copySelectedRows,
    openHeight,
    closeHeight,
    batchEditColumn,
    gridController,
  } = useTabulator({ ref: icnAirportShopMngGridRef })

  // recoil set
  const setIcnAirportShopMngResData = useSetRecoilState(icnAirportShopMngDetailAtom)
  //상세보기  api 호출
  const { refetch: getDetailRefetch, isFetching: getDetailFetching } = useCommonApiQuery({
    options: {
      enabled: false,
    },
    //  apiConfig: 'get',
    //  url: `${API_ICN_AIRPORT_SHOP_DETEIL}` + searchParams,
    apiConfig: 'post',
    params: searchParams,
    url: API_ICN_AIRPORT_SHOP_DETEIL

  })

  const columns = [

    {
      title: 'No.',
      field: 'rn',
      width: 70,
      hozAlign: 'center',
    },

    {
      title: '회사ID',
      field: 'coId',
      editor: 'input',
      visible: false,
    },
    {
      title: '점포ID',
      field: 'shopId',
      editor: 'input',
      visible: false,
    },
    {
      title: '사이트ID',
      field: 'steId',
      editor: 'input',
      visible: false,
    },

    {
      title: 'crnrNmEn',
      field: 'crnrNmEn',
      editor: 'input',
      visible: false,
    },
    {
      title: 'crnrNmCh',
      field: 'crnrNmCh',
      editor: 'input',
      visible: false,
    },
    {
      title: 'crnrNmJp',
      field: 'crnrNmJp',
      editor: 'input',
      visible: false,
    },
    {
      title: 'crnrDesc',
      field: 'crnrDesc',
      editor: 'input',
      visible: false,
    },
    {
      title: 'crnrDescEn',
      field: 'crnrDescEn',
      editor: 'input',
      visible: false,
    },
    {
      title: 'crnrDescCh',
      field: 'crnrDescCh',
      editor: 'input',
      visible: false,
    },
    {
      title: 'crnrDescJp',
      field: 'crnrDescJp',
      editor: 'input',
      visible: false,
    },
    {
      title: 'crnrSoldOut',
      field: 'crnrSoldOut',
      editor: 'input',
      visible: false,
    },
    {
      title: 'crnrBusyBasisTm',
      field: 'crnrBusyBasisTm',
      editor: 'input',
      visible: false,
    },
    {
      title: 'crnrBestBusyBasisTm',
      field: 'crnrBestBusyBasisTm',
      editor: 'input',
      visible: false,
    },
    {
      title: 'crnrKdbIp',
      field: 'crnrKdbIp',
      editor: 'input',
      visible: false,
    },
    {
      title: 'crnrKdbPort',
      field: 'crnrKdbPort',
      editor: 'input',
      visible: false,
    },
    {
      title: 'crnrKdbDbUserId',
      field: 'crnrKdbDbUserId',
      editor: 'input',
      visible: false,
    },
    {
      title: 'crnrKdbDbUserPwd',
      field: 'crnrKdbDbUserPwd',
      editor: 'input',
      visible: false,
    },
    {
      title: 'crnrImgFilePathUrl',
      field: 'crnrImgFilePathUrl',
      editor: 'input',
      visible: false,
    },
    {
      title: 'crnrImgFileNm',
      field: 'crnrImgFileNm',
      editor: 'input',
      visible: false,
    },
    {
      title: 'sortSerNo',
      field: 'sortSerNo',
      editor: 'input',
      visible: false,
    },
    {
      title: 'crnrBusyTypeCd',
      field: 'crnrBusyTypeCd',
      editor: 'input',
      visible: false,
    },
    {
      title: 'crnrLabel',
      field: 'crnrLabel',
      editor: 'input',
      visible: false,
    },

    {
      title: '코너코드',
      field: 'crnrId',
      width: 110,
      sorter: 'string',
      hozAlign: 'center',
    },
    {
      title: '코너명',
      field: 'crnrNm',
      sorter: 'string',
      hozAlign: 'left',
    },

    {
      title: '표시순서',
      field: 'sortSerNo',
      width: 80,
      sorter: 'number',
      hozAlign: 'center',
    },
    {
      title: '사용여부',
      field: 'useYn',

      formatter: function (cell, formatterParams, onRendered) {
        var value = cell.getValue()
        return `<input type="checkbox" ${value != 'N' ? 'checked' : ''}  disabled />`
      },

      width: 80,
      editor: false,
    },
  ]

  useEffect(() => {
    setIcnAirportShopMngResData([])
    return () => {
      setSearchParams({})
    }
  }, [])

  useDidMountEffect(() => {
    if (searchParams) {
      setIcnAirportShopMngResData([])
      getDetailRefetch().then((res) => setIcnAirportShopMngResData(get(res, 'data')))
      setCompSearchParams({
        coId: searchParams.coId,
        steId: searchParams.steId,
        shopId: searchParams.shopId,
        crnrId: searchParams.crnrId
      })
    }
  }, [searchParams])

  const handleRowClickSubEvent = (row) => {
    const coId = !row?.getData()?.coId ? '' : `${row.getData().coId}`
    const steId = !row?.getData()?.steId ? '' : `${row.getData().steId}`
    const shopId = !row?.getData()?.shopId ? '' : `${row.getData().shopId}`
    const crnrId = !row?.getData()?.crnrId ? '' : `${row.getData().crnrId}`
    const crnrNm = !row?.getData()?.crnrNm ? '' : `${row.getData().crnrNm}`
    const crnrTypeCd = !row?.getData()?.crnrTypeCd ? '' : `${row.getData().crnrTypeCd}`
    const useYn = !row?.getData()?.useYn ? '' : `${row.getData().useYn}`
    const crnrNmEn = !row?.getData()?.crnrNmEn ? '' : `${row.getData().crnrNmEn}`
    const crnrNmCh = !row?.getData()?.crnrNmCh ? '' : `${row.getData().crnrNmCh}`
    const crnrNmJp = !row?.getData()?.crnrNmJp ? '' : `${row.getData().crnrNmJp}`
    const crnrDesc = !row?.getData()?.crnrDesc ? '' : `${row.getData().crnrDesc}`
    const crnrDescEn = !row?.getData()?.crnrDescEn ? '' : `${row.getData().crnrDescEn}`
    const crnrDescCh = !row?.getData()?.crnrDescCh ? '' : `${row.getData().crnrDescCh}`
    const crnrDescJp = !row?.getData()?.crnrDescJp ? '' : `${row.getData().crnrDescJp}`
    const crnrSoldOut = !row?.getData()?.crnrSoldOut ? '' : `${row.getData().crnrSoldOut}`
    setSearchParams({ coId, steId, shopId, crnrId, crnrNm, crnrTypeCd, useYn, crnrNmEn, crnrNmCh, crnrNmJp, crnrDesc, crnrDescEn, crnrDescCh, crnrDescJp, crnrSoldOut })
  }

  const handleRowClickEvent = (e, row) => {


    // 변경사항 여부 체크
    if (getValues('crnrId') === "") {
      if (changeCheck()) {
        rowColorChangeUtil(row) // 선택한 row 색 변경
        setSelectedRow(row) // Row 선택 변경
        handleRowClickSubEvent(row)
      } else {
        confirm('변경사항이 있습니다. 계속 진행하시겠습니까?', {
          okCallBack() {
            rowColorChangeUtil(row) // 선택한 row 색 변경
            setSelectedRow(row) // Row 선택 변경
            handleRowClickSubEvent(row)
          },
        })
      }
    } else if (changeCheck()) {
      rowColorChangeUtil(row) // 선택한 row 색 변경
      setSelectedRow(row) // Row 선택 변경
      handleRowClickSubEvent(row)
    } else {
      confirm('변경사항이 있습니다. 계속 진행하시겠습니까?', {
        okCallBack() {
          rowColorChangeUtil(row) // 선택한 row 색 변경
          setSelectedRow(row) // Row 선택 변경
          handleRowClickSubEvent(row)
        },
      })
    }

  }

  const changeCheck = () => {

    let steFilePathUrl1 = (nullToStr(getValues('files1'), '') !== "") ? getValues('files1') : getValues('crnrImgFilePathUrl')
    let steFilePathUrl2 = (nullToStr(getValues('files2'), '') !== "") ? getValues('files2') : getValues('crnrMenuImgFilePathUrl')

    if (nullToStr(getValues('crnrNm'), '') === nullToStr(getValues('crnrNm2'), '') &&
      nullToStr(getValues('crnrNmEn'), '') === nullToStr(getValues('crnrNmEn2'), '') &&
      nullToStr(getValues('crnrNmCh'), '') === nullToStr(getValues('crnrNmCh2'), '') &&
      nullToStr(getValues('crnrNmJp'), '') === nullToStr(getValues('crnrNmJp2'), '') &&
      nullToStr(getValues('crnrDesc'), '') === nullToStr(getValues('crnrDesc2'), '') &&
      nullToStr(getValues('crnrDescEn'), '') === nullToStr(getValues('crnrDescEn2'), '') &&
      nullToStr(getValues('crnrDescCh'), '') === nullToStr(getValues('crnrDescCh2'), '') &&
      nullToStr(getValues('crnrDescJp'), '') === nullToStr(getValues('crnrDescJp2'), '') &&
      getValues('crnrBusyBasisIcnt') === getValues('crnrBusyBasisIcnt2') &&
      getValues('crnrBestBusyBasisIcnt') === getValues('crnrBestBusyBasisIcnt2') &&
      getValues('sortSerNo') === getValues('sortSerNo2') &&
      nullToStr(getValues('useYn'), '') === nullToStr(getValues('useYn2'), '') &&
      nullToStr(getValues('crnrLabel'), '') === nullToStr(getValues('crnrLabel2'), '') &&
      nullToStr(getValues('crnrLabelColorRgb'), '') === nullToStr(getValues('crnrLabelColorRgb2'), '') &&
      nullToStr(getValues('operStartTm'), '') === nullToStr(getValues('operStartTm2'), '') &&
      nullToStr(getValues('operTmntTm'), '') === nullToStr(getValues('operTmntTm2'), '') &&
      nullToStr(steFilePathUrl1, '') === nullToStr(getValues('crnrImgFilePathUrl2'), '') &&
      nullToStr(steFilePathUrl2, '') === nullToStr(getValues('crnrMenuImgFilePathUrl2'), '') &&
      nullToStr(getValues('crnrTypeCd'), '') === nullToStr(getValues('crnrTypeCd2'), '')
    ) {
      return true
    } else {
      return false
    }

  }


  return (
    <div className="grid">
      <div className="grid-title-total">
        <div className="grid-title">
          <h4>{props.title}</h4>
          <strong>
            총 <span className="fw-bold">{numberFormatter(totalCount || (props.icnAirportShopListData && props.icnAirportShopListData.length))}</span>건
          </strong>
        </div>
      </div>
      <SimpleTabulator
        id={`icnAirportShopGridRef-${uuid()}`}
        data={props.icnAirportShopListData}
        ref={props.icnAirportShopGridRef}
        layout="fitColumns"
        resizableColumnFit="true"
        placeholder='조회된 데이터가 없습니다.'
        columns={columns}
        clipboard={true}
        index="id"
        visibleStatusName={false} // 상태명 column 노출여부
        columnHeaderVertAlign="bottom"
        events={{
          rowClick(e, row) {
            handleRowClickEvent(e, row)
          },
        }}
      />
    </div>
  )


}

export default React.memo(forwardRef(IcnAirportShopMngGrid))








