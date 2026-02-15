import React, { useRef, useState ,useEffect} from 'react'
import { useForm, Controller } from 'react-hook-form'
import  IcnAirportShopMngSearchForm from 'components/cps/base/icnairportmng/IcnAirportShopMngSearchForm'
import  IcnAirportShopMngGrid from 'components/cps/base/icnairportmng/IcnAirportShopMngGrid'
import  IcnAirportShopMngTable from 'components/cps/base/icnairportmng/IcnAirportShopMngTable'
import Loading from 'components/common/loading/Loading'
import { ApiIcnAirportShopLst  } from 'api/cps/base/icnairportmng/icnairportshopmng-fetch'
import { useFwTab } from 'hooks/common/use-fw-tab'
import { useTabulator } from 'hooks/common/use-tabulator'
import 'assets/style/common.scss'
import 'assets/style/contents.scss'
import 'assets/style/grid.scss'
/**
 * @author doojin.lee
 * @date 2024.07.15
 * @description 인천공항 매장관리 화면
 * @returns
 */

const IcnAirportShopMng = (props) => {
  const { fwMenuName } = useFwTab()	
  // state
  const [icnAirportShopList, setIcnAirportShopList] = useState([])
   const initValues = {
    steId: '',
    steNm: ''
  }
  const [loading, setLoading] = useState(false)
  const [resetYn, setResetYn] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true);
  const searchFormdRef = useRef(null)
  const searchTableRef = useRef(null)
  // search useform
  const searchUseForm = useForm({
    // 초기값 지정
    defaultValues: initValues,
  })
  
  const icnAirportShopGridRef = useRef(null)
  
  const { register, reset, control, watch, getValues, setValue } = searchUseForm
  const crnrGrupGridRef = useRef(null)
  const crnrGrupTabulator = useTabulator({ ref: crnrGrupGridRef })
  
  // 그리드 조회 API
  const { postRefetch, isFetching } = ApiIcnAirportShopLst(searchUseForm.watch, setIcnAirportShopList)
  
  // 그리드 조회
  const handleSearch = () => {
	// 그리드초기화
     dataReset()
    // 컴포넌트 용   
     searchFormdRef.current.handleSearch()
//      setResetYn(true)
  }
  
   //저장,수정후 그리드 조회
  const handleSaveAfterSearch = () => {
	// 그리드초기화
     dataReset()
    // 컴포넌트 용   
     searchFormdRef.current.handleSaveAfterSearch()
//      setResetYn(true)
  }
  // 상세보기 클리어 
  const handleTablReset = () => {
    // 컴포넌트 용  
     searchTableRef.current.handleParentReset()
  }
  

 /**
   * 데이터 담는 state 초기화   
   */
  const dataReset = () => {
	//    setValue("aaa","333")
    //매장목록 초기화
    setIcnAirportShopList([]) 
  }
  
  return (
    <>
        <div className="component">
             <IcnAirportShopMngSearchForm  {...searchUseForm} title={fwMenuName}  setIsDisabled={setIsDisabled}  postRefetch={postRefetch}   dataReset={dataReset}  handleTablReset  ={handleTablReset}   searchFormdRef={searchFormdRef} Controller={Controller} /> 
        </div>
        <div className="component-wrap-2">
          <div className="component component-sm">
            <IcnAirportShopMngGrid 
      		  title={'매장 목록'}
      		  searchUseForm= {searchUseForm}
    		  icnAirportShopListData={icnAirportShopList}
    		  icnAirportShopGridRef  ={icnAirportShopGridRef}
              /> 
          </div>
          <div className="component component-lg h100p">
             <IcnAirportShopMngTable  icnAirportShopGridRef  ={icnAirportShopGridRef}  handleSaveAfterSearch =  {handleSaveAfterSearch}  searchUseForm ={searchUseForm}
               setIsDisabled={setIsDisabled}  isDisabled={isDisabled}    shpId={searchUseForm.watch('shpId')}
                 steId={searchUseForm.watch('steSearchId')}  steNm={searchUseForm.watch('steNm')}     
                 searchTableRef={searchTableRef}   handleSearch={handleSearch}  /> 
          </div>
        </div>
      
    </>
  )
}


export default React.memo(IcnAirportShopMng)
