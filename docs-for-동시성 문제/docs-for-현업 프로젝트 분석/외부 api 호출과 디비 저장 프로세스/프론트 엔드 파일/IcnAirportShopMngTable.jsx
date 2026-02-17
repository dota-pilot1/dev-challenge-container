import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Controller } from 'react-hook-form'
import { nullToStr } from 'utils/string-util'
import { useRecoilValue } from 'recoil'
import { cloneDeep, get, isEmpty } from 'lodash'
import SelectCommonCode from 'components/cps/common/SelectCommonCode'
import { icnAirportShopMngDetailAtom } from 'store/atoms/cps/base/icnairportmng/icnairportshopmng-atom'
import { getMessage } from 'utils/message-util'
import { useAlert, useConfirm } from 'hooks/popup/use-common-popup'
import { rowColorBackUtil } from 'utils/tabulator-util'

/**
 * @author doojin.lee
 * @date 2024.07.15
 * @description 인천공항 매장관리 상세보기
 * @returns
 */

const IcnAirportShopMngTable = (props) => {

  /**
   * 초기값
   */

  const initValues = {
    brandId: '',
    salesUnitCode: '',
    storeId: '',
    storeType: '',
    telephone: '',
    storeNamesKoKr: '',
    storeNamesEnUs: '',
    storeNamesJaJp: '',
    storeNamesZhCn: '',
    storeNamesZhTw: '',
    storeNoticesKoKr: '',
    storeNoticesEnUs: '',
    storeNoticesJaJp: '',
    storeNoticesZhCn: '',
    storeNoticesZhTw: '',
    useYn: false,
  }
  const brandId = useRef()
  const salesUnitCode = useRef()
  const storeId = useRef()
  const storeType = useRef()
  const telephone = useRef()
  const storeNamesKoKr = useRef()
  const storeNamesEnUs = useRef()
  const storeNamesJaJp = useRef()
  const storeNamesZhCn = useRef()
  const storeNamesZhTw = useRef()
  const storeNoticesKoKr = useRef()
  const storeNoticesEnUs = useRef()
  const storeNoticesJaJp = useRef()
  const storeNoticesZhCn = useRef()
  const storeNoticesZhTw = useRef()
  const useYn = useRef()
  const [activeTab, setActiveTab] = useState('tab1')
  const { alert } = useAlert()
  const { confirm } = useConfirm()
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    getValues,
    formState: { errors },
    setValue,
    postRefetch,
  } = props.searchUseForm
  // recoil get
  const getIcnAirportShopMngDetailData = useRecoilValue(icnAirportShopMngDetailAtom)
  const tmpData = cloneDeep(getIcnAirportShopMngDetailData)
  const [isReadOnly, setIsReadOnly] = useState(true)
  
  /**
   * 그리드 행을 클릭했을 때 실행
   */
  useEffect(() => {
    if (!isEmpty(getIcnAirportShopMngDetailData)) {
      setIsReadOnly(false)
      
      // 기본 필드 설정
      setValue('brandId', get(tmpData, 'brandId') || '')
      setValue('salesUnitCode', get(tmpData, 'salesUnitCode') || '')
      setValue('storeId', get(tmpData, 'storeId') || '')
      setValue('storeType', get(tmpData, 'storeType') || '')
      setValue('telephone', get(tmpData, 'telephone') || '')
      setValue('useYn', get(tmpData, 'useYn') === 'Y' || get(tmpData, 'useYn') === true ? true : false)
      
      // storeNames 다국어 필드 설정
      const storeNames = get(tmpData, 'storeNames') || {}
      setValue('storeNamesKoKr', storeNames['ko-kr'] || '')
      setValue('storeNamesEnUs', storeNames['en-us'] || '')
      setValue('storeNamesJaJp', storeNames['ja-jp'] || '')
      setValue('storeNamesZhCn', storeNames['zh-cn'] || '')
      setValue('storeNamesZhTw', storeNames['zh-tw'] || '')
      
      // storeNotices 다국어 필드 설정
      const storeNotices = get(tmpData, 'storeNotices') || {}
      setValue('storeNoticesKoKr', storeNotices['ko-kr'] || '')
      setValue('storeNoticesEnUs', storeNotices['en-us'] || '')
      setValue('storeNoticesJaJp', storeNotices['ja-jp'] || '')
      setValue('storeNoticesZhCn', storeNotices['zh-cn'] || '')
      setValue('storeNoticesZhTw', storeNotices['zh-tw'] || '')
      
      // 비교용 필드 설정 (변경사항 체크용)
      setValue('brandId2', get(tmpData, 'brandId') || '')
      setValue('salesUnitCode2', get(tmpData, 'salesUnitCode') || '')
      setValue('storeId2', get(tmpData, 'storeId') || '')
      setValue('storeType2', get(tmpData, 'storeType') || '')
      setValue('telephone2', get(tmpData, 'telephone') || '')
      setValue('useYn2', get(tmpData, 'useYn') === 'Y' || get(tmpData, 'useYn') === true ? true : false)
      setValue('storeNamesKoKr2', storeNames['ko-kr'] || '')
      setValue('storeNamesEnUs2', storeNames['en-us'] || '')
      setValue('storeNamesJaJp2', storeNames['ja-jp'] || '')
      setValue('storeNamesZhCn2', storeNames['zh-cn'] || '')
      setValue('storeNamesZhTw2', storeNames['zh-tw'] || '')
      setValue('storeNoticesKoKr2', storeNotices['ko-kr'] || '')
      setValue('storeNoticesEnUs2', storeNotices['en-us'] || '')
      setValue('storeNoticesJaJp2', storeNotices['ja-jp'] || '')
      setValue('storeNoticesZhCn2', storeNotices['zh-cn'] || '')
      setValue('storeNoticesZhTw2', storeNotices['zh-tw'] || '')

      props.setIsDisabled(false)
    } else {
      handleParentReset()
    }
  }, [getIcnAirportShopMngDetailData])  

  /**
   * 저장버튼을 클릭했을 때 확인
   */
  const handlerConfirm = () => {
    if (changeCheck()) {
      alert('변경사항이 없습니다.')
      return
    } else if (props.isDisabled) {
      alert('변경사항이 없습니다.')
      return
    }

    // 필수 필드 체크
    if (getValues('brandId') === '') {
      setActiveTab('tab1')
      alert('F&B+ 브랜드는 필수입력 항목입니다.', {
        okCallBack() {
          brandId.current?.focus()
        },
      })
      return
    } else if (getValues('salesUnitCode') === '') {
      setActiveTab('tab1')
      alert('매출 단위 코드는 필수입력 항목입니다.', {
        okCallBack() {
          salesUnitCode.current?.focus()
        },
      })
      return
    } else if (getValues('storeId') === '') {
      setActiveTab('tab1')
      alert('입정사 매장 ID는 필수입력 항목입니다.', {
        okCallBack() {
          storeId.current?.focus()
        },
      })
      return
    } else if (getValues('storeType') === '') {
      setActiveTab('tab1')
      alert('매장 유형은 필수입력 항목입니다.', {
        okCallBack() {
          storeType.current?.focus()
        },
      })
      return
    } else if (getValues('telephone') === '') {
      setActiveTab('tab1')
      alert('전화번호는 필수입력 항목입니다.', {
        okCallBack() {
          telephone.current?.focus()
        },
      })
      return
    } else if (getValues('storeNamesKoKr') === '') {
      setActiveTab('tab2')
      alert('매장명(한국어)은 필수입력 항목입니다.', {
        okCallBack() {
          storeNamesKoKr.current?.focus()
        },
      })
      return
    }

    // storeNames 객체 생성
    const storeNames = {
      'ko-kr': getValues('storeNamesKoKr') || '',
      'en-us': getValues('storeNamesEnUs') || '',
      'ja-jp': getValues('storeNamesJaJp') || '',
      'zh-cn': getValues('storeNamesZhCn') || '',
      'zh-tw': getValues('storeNamesZhTw') || '',
    }

    // storeNotices 객체 생성 (선택 필드)
    const storeNotices = {
      'ko-kr': getValues('storeNoticesKoKr') || '',
      'en-us': getValues('storeNoticesEnUs') || '',
      'ja-jp': getValues('storeNoticesJaJp') || '',
      'zh-cn': getValues('storeNoticesZhCn') || '',
      'zh-tw': getValues('storeNoticesZhTw') || '',
    }

    const requestDto = {
      brandId: getValues('brandId'),
      salesUnitCode: getValues('salesUnitCode'),
      storeId: getValues('storeId'),
      storeType: getValues('storeType'),
      telephone: getValues('telephone'),
      storeNames: storeNames,
      storeNotices: storeNotices,
      useYn: getValues('useYn') ? 'Y' : 'N',
    }

    confirm(getMessage('common_msg_003', { status: '저장' }), {
      okCallBack() {
        callSave(requestDto)
      },
    })
  }

  const callSave = (requestDto) => {
    // TODO: 실제 API 호출 구현 필요
    // 현재는 외부 인터페이스 전송 함수 구조만 준비
    console.log('저장할 데이터:', requestDto)
    
    // 외부 인터페이스 전송 함수 호출 (구현 예정)
    // sendExternalInterface(requestDto)
    
    alert(getMessage('common_msg_001', { status: '저장' }), {
      okCallBack() {
        props.handleSaveAfterSearch()
        handleParentReset()
      },
    })
  }

  const handleReset = () => {
    setReset()
  }

  const handleSetReset = () => {
    setReset()
    props.setIsDisabled(false)
    rowColorBackUtil(props.icnAirportShopGridRef.current)
  }

  const setReset = () => {
    setValue('brandId', '')
    setValue('salesUnitCode', '')
    setValue('storeId', '')
    setValue('storeType', '')
    setValue('telephone', '')
    setValue('storeNamesKoKr', '')
    setValue('storeNamesEnUs', '')
    setValue('storeNamesJaJp', '')
    setValue('storeNamesZhCn', '')
    setValue('storeNamesZhTw', '')
    setValue('storeNoticesKoKr', '')
    setValue('storeNoticesEnUs', '')
    setValue('storeNoticesJaJp', '')
    setValue('storeNoticesZhCn', '')
    setValue('storeNoticesZhTw', '')
    setValue('useYn', false)

    setValue('brandId2', '')
    setValue('salesUnitCode2', '')
    setValue('storeId2', '')
    setValue('storeType2', '')
    setValue('telephone2', '')
    setValue('storeNamesKoKr2', '')
    setValue('storeNamesEnUs2', '')
    setValue('storeNamesJaJp2', '')
    setValue('storeNamesZhCn2', '')
    setValue('storeNamesZhTw2', '')
    setValue('storeNoticesKoKr2', '')
    setValue('storeNoticesEnUs2', '')
    setValue('storeNoticesJaJp2', '')
    setValue('storeNoticesZhCn2', '')
    setValue('storeNoticesZhTw2', '')
    setValue('useYn2', false)
  }

  /**
   *  초기화버튼 클릭할때 클리어
   */
  const handleParentReset = () => {
    setReset()
    setIsReadOnly(true)
  }

  // 부모컴포넌트에서 사용하는 함수 선언
  useImperativeHandle(props.searchTableRef, () => {
    return {
      handleParentReset,
    }
  })

  const changeCheck = () => {
    if (nullToStr(getValues('brandId'), '') === nullToStr(getValues('brandId2'), '') &&
      nullToStr(getValues('salesUnitCode'), '') === nullToStr(getValues('salesUnitCode2'), '') &&
      nullToStr(getValues('storeId'), '') === nullToStr(getValues('storeId2'), '') &&
      nullToStr(getValues('storeType'), '') === nullToStr(getValues('storeType2'), '') &&
      nullToStr(getValues('telephone'), '') === nullToStr(getValues('telephone2'), '') &&
      nullToStr(getValues('storeNamesKoKr'), '') === nullToStr(getValues('storeNamesKoKr2'), '') &&
      nullToStr(getValues('storeNamesEnUs'), '') === nullToStr(getValues('storeNamesEnUs2'), '') &&
      nullToStr(getValues('storeNamesJaJp'), '') === nullToStr(getValues('storeNamesJaJp2'), '') &&
      nullToStr(getValues('storeNamesZhCn'), '') === nullToStr(getValues('storeNamesZhCn2'), '') &&
      nullToStr(getValues('storeNamesZhTw'), '') === nullToStr(getValues('storeNamesZhTw2'), '') &&
      nullToStr(getValues('storeNoticesKoKr'), '') === nullToStr(getValues('storeNoticesKoKr2'), '') &&
      nullToStr(getValues('storeNoticesEnUs'), '') === nullToStr(getValues('storeNoticesEnUs2'), '') &&
      nullToStr(getValues('storeNoticesJaJp'), '') === nullToStr(getValues('storeNoticesJaJp2'), '') &&
      nullToStr(getValues('storeNoticesZhCn'), '') === nullToStr(getValues('storeNoticesZhCn2'), '') &&
      nullToStr(getValues('storeNoticesZhTw'), '') === nullToStr(getValues('storeNoticesZhTw2'), '') &&
      getValues('useYn') === getValues('useYn2')
    ) {
      return true
    } else {
      return false
    }
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  return (
    <div className='component'>
      <div className='tab'>
        <div className='tab-wrap'>
          <ul>
            <li className={`${activeTab === 'tab1' ? 'active' : ''}`}>
              <button className='tab-btn' onClick={() => handleTabClick('tab1')}>
                기본 정보
              </button>
            </li>
            <li className={`${activeTab === 'tab2' ? 'active' : ''}`}>
              <button className='tab-btn' onClick={() => handleTabClick('tab2')}>
                다국어 정보
              </button>
            </li>
          </ul>
        </div>
      </div>

      {activeTab === 'tab1' ? (
        <div className='component h500 show'>
          <div className='search-detail'>
            <div className='search-form'>
              <div className='title'>
                <h4 className='title-tooltip'>
                  기본 정보
                </h4>
                <div className='title-button'>
                  <button className='btn outline-button' onClick={() => handleReset()}> 초기화</button>
                  <button className='btn' onClick={(e) => {
                    e.preventDefault()
                    handlerConfirm()
                  }}>
                    저장
                  </button>
                </div>
              </div>
              <div className='search-form-wrap'>
                <div className='form-line'>
                  <div className='form-wrap half'>
                    <label htmlFor='a1' className='in-title'>
                      매장코드
                    </label>
                    <Controller
                      name='storeId'
                      control={control}
                      render={({ field }) => (
                        <input
                          id='a1'
                          type='text'
                          className='form-input'
                          value={field.value}
                          onChange={field.onChange}
                          placeholder=''
                          disabled='true'
                          ref={storeId}
                          maxLength={50}
                        />
                      )}
                    />
                  </div>
                  <div className='form-wrap half'>
                    <label htmlFor='a2' className='in-title required'>
                      매장유형
                    </label>
                    <SelectCommonCode
                      {...register('storeType')}
                      control={control}
                      commClCd={['FP002']}
                      filterCode={'commCd'}
                      filterValue={[]}
                      allCheckBox={true}
                      allCheckBoxObject={{
                        title: '선택',
                        value: '',
                      }}
                      disabled={props.isDisabled}
                    />
                  </div>
                </div>
                <div className='form-line'>
                  <div className='form-wrap half'>
                    <label htmlFor='a3' className='in-title required'>
                      브랜드ID
                    </label>
                    <Controller
                      name='brandId'
                      control={control}
                      render={({ field }) => (
                        <input
                          id='a3'
                          type='text'
                          className='form-input'
                          value={field.value}
                          onChange={field.onChange}
                          placeholder=''
                          ref={brandId}
                          maxLength={50}
                          disabled={props.isDisabled}
                        />
                      )}
                    />
                  </div>
                  <div className='form-wrap half'>
                    <label htmlFor='a4' className='in-title required'>
                      판매단위코드
                    </label>
                    <Controller
                      name='salesUnitCode'
                      control={control}
                      render={({ field }) => (
                        <input
                          id='a4'
                          type='text'
                          className='form-input'
                          value={field.value}
                          onChange={field.onChange}
                          placeholder=''
                          ref={salesUnitCode}
                          maxLength={50}
                          disabled={props.isDisabled}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className='form-line'>
                  <div className='form-wrap one'>
                    <label htmlFor='a5' className='in-title required'>
                      전화번호
                    </label>
                    <Controller
                      name='telephone'
                      control={control}
                      render={({ field }) => (
                        <input
                          id='a5'
                          type='text'
                          className='form-input'
                          value={field.value}
                          onChange={field.onChange}
                          placeholder='전화번호를 입력해주세요'
                          ref={telephone}
                          maxLength={20}
                          disabled={props.isDisabled}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className='form-line'>
                  <div className='form-wrap half'>
                    <label htmlFor='a3' className='in-title'>
                      사용여부
                    </label>
                    <form className='form checkbox' id='g'>
                      <div className='checkbox-wrap'>
                        <Controller
                          control={control}
                          name='useYn'
                          render={({ field }) => (
                            <input
                              type='checkbox'
                              name={field.name}
                              checked={field.value === true || field.value === 'Y'}
                              onChange={(e) => {
                                setValue('useYn', e.target.checked)
                              }}
                              ref={useYn}
                              disabled={props.isDisabled}
                            />
                          )}
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
      {activeTab === 'tab2' ? (
        <div className='component h500 show'>
          <div className='search-detail'>
            <div className='search-form'>
              <div className='title'>
                <h4 className='title-tooltip'>
                  다국어 정보
                </h4>
                <div className='title-button'>
                  <button className='btn' onClick={(e) => {
                    e.preventDefault()
                    handlerConfirm()
                  }}>
                    저장
                  </button>
                </div>
              </div>
              <div className='search-form-wrap'>
                <div className='form-line'>
                  <div className='form-wrap half'>
                    <label htmlFor='a1' className='in-title'>
                      매장코드
                    </label>
                    <Controller
                      name='storeId'
                      control={control}
                      render={({ field }) => (
                        <input
                          id='a1'
                          type='text'
                          className='form-input'
                          value={field.value}
                          onChange={field.onChange}
                          placeholder=''
                          disabled='true'
                          maxLength={50}
                        />
                      )}
                    />
                  </div>
                  <div className='form-wrap half'>
                    <label htmlFor='a2' className='in-title required'>
                      매장명(한국어)
                    </label>
                    <Controller
                      name='storeNamesKoKr'
                      control={control}
                      render={({ field }) => (
                        <input
                          id='a2'
                          type='text'
                          className='form-input'
                          value={field.value}
                          onChange={field.onChange}
                          placeholder=''
                          ref={storeNamesKoKr}
                          maxLength={100}
                          disabled={props.isDisabled}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className='form-line'>
                  <div className='form-wrap half'>
                    <label htmlFor='a3' className='in-title'>
                      매장명(영어)
                    </label>
                    <Controller
                      name='storeNamesEnUs'
                      control={control}
                      render={({ field }) => (
                        <input
                          id='a3'
                          type='text'
                          className='form-input'
                          value={field.value}
                          onChange={field.onChange}
                          placeholder=''
                          ref={storeNamesEnUs}
                          maxLength={100}
                          disabled={props.isDisabled}
                        />
                      )}
                    />
                  </div>
                  <div className='form-wrap half'>
                    <label htmlFor='a4' className='in-title'>
                      매장명(일본어)
                    </label>
                    <Controller
                      name='storeNamesJaJp'
                      control={control}
                      render={({ field }) => (
                        <input
                          id='a4'
                          type='text'
                          className='form-input'
                          value={field.value}
                          onChange={field.onChange}
                          placeholder=''
                          ref={storeNamesJaJp}
                          maxLength={100}
                          disabled={props.isDisabled}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className='form-line'>
                  <div className='form-wrap half'>
                    <label htmlFor='a5' className='in-title'>
                      매장명(중국어 간체)
                    </label>
                    <Controller
                      name='storeNamesZhCn'
                      control={control}
                      render={({ field }) => (
                        <input
                          id='a5'
                          type='text'
                          className='form-input'
                          value={field.value}
                          onChange={field.onChange}
                          placeholder=''
                          ref={storeNamesZhCn}
                          maxLength={100}
                          disabled={props.isDisabled}
                        />
                      )}
                    />
                  </div>
                  <div className='form-wrap half'>
                    <label htmlFor='a6' className='in-title'>
                      매장명(중국어 번체)
                    </label>
                    <Controller
                      name='storeNamesZhTw'
                      control={control}
                      render={({ field }) => (
                        <input
                          id='a6'
                          type='text'
                          className='form-input'
                          value={field.value}
                          onChange={field.onChange}
                          placeholder=''
                          ref={storeNamesZhTw}
                          maxLength={100}
                          disabled={props.isDisabled}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className='form-line'>
                  <div className='form-wrap one'>
                    <label htmlFor='a7' className='in-title'>
                      매장 공지(한국어)
                    </label>
                    <Controller
                      name='storeNoticesKoKr'
                      control={control}
                      render={({ field }) => (
                        <textarea
                          className='textarea'
                          value={field.value}
                          onChange={field.onChange}
                          placeholder='매장 공지를 입력해주세요'
                          ref={storeNoticesKoKr}
                          maxLength={1000}
                          disabled={props.isDisabled}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className='form-line'>
                  <div className='form-wrap one'>
                    <label htmlFor='a8' className='in-title'>
                      매장 공지(영어)
                    </label>
                    <Controller
                      name='storeNoticesEnUs'
                      control={control}
                      render={({ field }) => (
                        <textarea
                          className='textarea'
                          value={field.value}
                          onChange={field.onChange}
                          placeholder='매장 공지를 입력해주세요'
                          ref={storeNoticesEnUs}
                          maxLength={1000}
                          disabled={props.isDisabled}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className='form-line'>
                  <div className='form-wrap one'>
                    <label htmlFor='a9' className='in-title'>
                      매장 공지(일본어)
                    </label>
                    <Controller
                      name='storeNoticesJaJp'
                      control={control}
                      render={({ field }) => (
                        <textarea
                          className='textarea'
                          value={field.value}
                          onChange={field.onChange}
                          placeholder='매장 공지를 입력해주세요'
                          ref={storeNoticesJaJp}
                          maxLength={1000}
                          disabled={props.isDisabled}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className='form-line'>
                  <div className='form-wrap one'>
                    <label htmlFor='a10' className='in-title'>
                      매장 공지(중국어 간체)
                    </label>
                    <Controller
                      name='storeNoticesZhCn'
                      control={control}
                      render={({ field }) => (
                        <textarea
                          className='textarea'
                          value={field.value}
                          onChange={field.onChange}
                          placeholder='매장 공지를 입력해주세요'
                          ref={storeNoticesZhCn}
                          maxLength={1000}
                          disabled={props.isDisabled}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className='form-line'>
                  <div className='form-wrap one'>
                    <label htmlFor='a11' className='in-title'>
                      매장 공지(중국어 번체)
                    </label>
                    <Controller
                      name='storeNoticesZhTw'
                      control={control}
                      render={({ field }) => (
                        <textarea
                          className='textarea'
                          value={field.value}
                          onChange={field.onChange}
                          placeholder='매장 공지를 입력해주세요'
                          ref={storeNoticesZhTw}
                          maxLength={1000}
                          disabled={props.isDisabled}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default React.memo(IcnAirportShopMngTable)
