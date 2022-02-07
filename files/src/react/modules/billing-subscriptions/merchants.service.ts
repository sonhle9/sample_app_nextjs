import {ISearchMerchantRequest, IGetMerchantsSmartpayRequest, Merchant} from './merchants.type';
import {apiClient} from '../../lib/ajax';
import {environment} from '../../../environments/environment';
import {MerchantTypeCodes} from '../../../shared/enums/merchant.enum';

const baseUrl = `${environment.merchantsApiBaseUrl}/api/merchants`;

export const getMerchants = async (req: ISearchMerchantRequest) => {
  const {data: merchants} = await apiClient.get<Merchant[]>(`${baseUrl}/admin/merchants`, {
    params: {
      perPage: req.perPage,
      page: req.page,
      name: req.name || undefined,
      sortBy: 'name',
    },
  });

  return merchants;
};

export const getMerchantsSmartpay = async (req: IGetMerchantsSmartpayRequest) => {
  const {data: merchants} = await apiClient.get<Merchant[]>(`${baseUrl}/admin/merchants`, {
    params: {
      perPage: req.perPage,
      page: req.page,
      name: req.name || undefined,
      merchantTypes: MerchantTypeCodes.SMART_PAY_ACCOUNT,
    },
  });

  return merchants;
};
