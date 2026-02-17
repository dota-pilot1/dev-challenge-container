import React, { useEffect, useImperativeHandle, useState } from 'react'
import SteComboComp from 'components/cps/common/SteComboComp'
import { useAlert ,useConfirm} from 'hooks/popup/use-common-popup'
import useDidMountEffect from 'pages/common/customHooks/CustomHooks'
import { nullToStr } from 'utils/string-util'
import { pdfOpen } from '../../../../utils/pdf-utils'
import { useFwTab } from 'hooks/common/use-fw-tab'
const IcnAirportShopMngSearchForm = (props) => {
	
  const { title, watch, register, handleSubmit, reset, control, getValues, Controller, setValue, postRefetch,searchUseForm,searchFormdRef,setFocus } = props
  const { alert } = useAlert()
  const [showPopup, setShowPopup] = useState(false)
  const [getPopVisible, setPopVisible] = useState(false)
  const { confirm } = useConfirm()
  const {tabs, currentTabIndex, fwMenuName } = useFwTab()
  
  // 그리드 조회시 정합성 체크
  const validateCheck = () => {
    if (
      (!getValues('steSearchId'))
    ) {
      alert('사이트코드는 필수입력 항목입니다.')
      document.getElementById("steSearchId").focus()
      return false
    } else if(!getValues('steNm')) {  
      alert('사이트이름은 필수입력 항목입니다.')
      return false
    } else {
      return true
    }
  }
	 // 사용자 매뉴얼 다운로드
  const handleFileDownload = () => {
    //활성화된 화면 프로그램ID 파라미터로 입력 // pdfOpen('!P!C-COM-FS-12010101')
    pdfOpen(tabs[currentTabIndex].id)
  }     
  
   const changeCheck = () => {
	      
	let  steFilePathUrl1 = (nullToStr(getValues('files1'),'')!=="") ? getValues('files1') : getValues('crnrImgFilePathUrl')     
	let  steFilePathUrl2 = (nullToStr(getValues('files2'),'')!=="") ? getValues('files2') : getValues('crnrMenuImgFilePathUrl')  

    if (  nullToStr(getValues('crnrNm') ,'')        ===  nullToStr(getValues('crnrNm2'),'')  &&
	      nullToStr(getValues('crnrNmEn'),'')       ===  nullToStr(getValues('crnrNmEn2'),'')  &&
	      nullToStr(getValues('crnrNmCh'),'')       ===  nullToStr(getValues('crnrNmCh2'),'')  &&
	      nullToStr(getValues('crnrNmJp'),'')      	===  nullToStr(getValues('crnrNmJp2') ,'') &&    
	      nullToStr(getValues('crnrDesc'),'')      	===  nullToStr(getValues('crnrDesc2') ,'') &&    
	      nullToStr(getValues('crnrDescEn'),'')     ===  nullToStr(getValues('crnrDescEn2') ,'') &&    
	      nullToStr(getValues('crnrDescCh'),'')     ===  nullToStr(getValues('crnrDescCh2') ,'') &&    
	      nullToStr(getValues('crnrDescJp'),'')     ===  nullToStr(getValues('crnrDescJp2') ,'') &&    
	      getValues('crnrBusyBasisIcnt')      		===  getValues('crnrBusyBasisIcnt2')  &&    
	      getValues('crnrBestBusyBasisIcnt')      	===  getValues('crnrBestBusyBasisIcnt2')  &&  
	      getValues('sortSerNo')      				===  getValues('sortSerNo2')  &&    
	      nullToStr(getValues('useYn'),'')     ===  nullToStr(getValues('useYn2') ,'') &&    
	      nullToStr(getValues('crnrLabel'),'')     ===  nullToStr(getValues('crnrLabel2') ,'') &&    
	      nullToStr(getValues('crnrLabelColorRgb'),'')     ===  nullToStr(getValues('crnrLabelColorRgb2') ,'') &&    
	    
	      nullToStr(getValues('operStartTm'),'')     ===  nullToStr(getValues('operStartTm2') ,'') &&  
	      nullToStr(getValues('operTmntTm'),'')     ===  nullToStr(getValues('operTmntTm2') ,'') &&    
		  nullToStr(steFilePathUrl1 ,'')    ===  nullToStr(getValues('crnrImgFilePathUrl2') ,'') &&  
		   nullToStr(steFilePathUrl2 ,'')   ===  nullToStr(getValues('crnrMenuImgFilePathUrl2') ,'') &&  
	      nullToStr(getValues('crnrTypeCd'),'')     ===  nullToStr(getValues('crnrTypeCd2') ,'')
	      )
	          {
		  return true
	}else{
		return false
	}	  
	
  }
  
   // 그리드 조회
  const handleSearch = async () => {
	 if (!validateCheck()) {
      return
    }
    
    if(nullToStr(getValues('crnrId') ,'')  === "" ){
			if(changeCheck()){
				props.dataReset()
			     await props.handleTablReset()
			     postRefetch()
			     props.setIsDisabled(true)
			}else{
				confirm('변경사항이 있습니다. 계속 진행하시겠습니까?', {
		        okCallBack() {
		         props.dataReset()
			      props.handleTablReset()
			     postRefetch()
			     props.setIsDisabled(true)
		        },
		      })
			}
    }else  if(changeCheck()){
			  props.dataReset()
			   await props.handleTablReset()
			  postRefetch()
			    props.setIsDisabled(true)
	}else{
		  if(props.isDisabled){
			     props.dataReset()
			     await props.handleTablReset()
			     postRefetch()
			     props.setIsDisabled(true)
		  }else{
			  confirm('변경사항이 있습니다. 계속 진행하시겠습니까?', {
		        okCallBack() {
		         props.dataReset()
			      props.handleTablReset()
			     postRefetch()
			     props.setIsDisabled(true)
		        },
		      })
		  } 
	}
 }
 
 const handleSaveAfterSearch = async () => {
	 if (!validateCheck()) {
      return
    }
     props.dataReset()
     await props.handleTablReset()
     postRefetch()
     props.setIsDisabled(true)

  }
  
  // 부모 컴포넌트에서 사용할 함수를 선언
  useImperativeHandle(searchFormdRef, () => {
    return {
      handleSearch,
      handleSaveAfterSearch,
    }
  })
  
  // 입력폼 초기화및 그리드 초기화 
  const handleReset = async () => {

  //  reset()
    setValue('steSearchId','')
    setValue('steNm','')
    props.dataReset()
    await props.handleTablReset()
    props.setIsDisabled(true)
    
    setValue('files1', [])
    setValue('files2', [])
    document.getElementById("steSearchId").focus()
  }
  


  const schformRender = () => (
	<>  
	<div className="search-form grid3">
		<div className="search-form-wrap">
			<div className="form-line">
	        	<SteComboComp
	            control={control} //useform의 control(필수)
	            setValue={setValue} //useform의 setValue(필수)
	            watch={watch} //useform의 watch(필수)
	            register={register} //useform의 register(필수)
	            steIdSchNm={'steSearchId'} //입력하지 않으면 default : schSteId
	            steNmSchNm={'steNm'} //입력하지 않으면 default : schSteNm
	            
	            shpIdSchNm={'shpId'} 
	            shpNmSchNm={'shpNm'} 
	            
	            selectBoxLabelRequired={'Y'} //라벨에 필수값 표시, 입력하지 않으면 표시안함
	          	// inputWidth={'two'}
	          />
	
			</div> 
		</div>
	</div>
	 </>
   )
   
   return (
    <>
        <div className="title">
          <h3 className="title-tooltip">
             {fwMenuName}
            <button className="tooltip-btn" 
             onClick={(e) => {
				e.preventDefault()
                handleFileDownload()
              }}>
           
              <span className="tooltip-icon">Tooltip on</span>
              <span className="tooltip-contents hide">매뉴얼 조회</span>
            </button>
          </h3>
          <div>
            <button className="btn outline-button" type="button" onClick={() => handleReset()}>
              초기화
            </button>
            <button className="btn btn-gray" onClick={(e) => {
				e.preventDefault()
                handleSearch()
              }}>
              조회
            </button>
          </div>
        </div>
        {schformRender()}
      
      
    </>
  )
  
  
}

export default React.memo(IcnAirportShopMngSearchForm)


