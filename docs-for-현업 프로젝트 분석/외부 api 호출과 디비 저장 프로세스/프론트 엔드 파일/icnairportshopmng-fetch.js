import { useCommonApiQuery } from 'hooks/common/use-common-api-query';
import { cloneDeep } from "lodash";
import moment from 'moment';
import { getUserInfoFromSessionStorage } from 'utils/user-info-storage-util'
const API_ICN_AIRPORT_SHOP_LIST 		  = '/api/base/icnairportmng/v1.0/selecticnairportshoplst';
export const API_ICN_AIRPORT_SHOP_DETEIL = '/api/base/icnairportmng/v1.0/selecticnairportshopdtl';
export const API_ICN_AIRPORT_SHOP_UPDATE   = '/api/base/icnairportmng/v1.0/updateicnairportshop';
export const API_ICN_AIRPORT_SHOP_INSERT   = '/api/base/icnairportmng/v1.0/inserticnairportshop';



export const ApiIcnAirportShopLst = (watch, setData) => {
  const {
    isFetching: isFetching,
    refetch: postRefetch,
  } = useCommonApiQuery({
    options: {
      enabled: false,
      onSuccess: async (res) => {
        const resData = await cloneDeep(res.data);
        setData(resData)
      },
    },
    params: {
      steId: watch('steSearchId')
      ,coId: getUserInfoFromSessionStorage().coId
    },
    apiConfig: 'post',
    url: API_ICN_AIRPORT_SHOP_LIST,
    queryParamBoolean: true
  })
  return { postRefetch, isFetching };
}








