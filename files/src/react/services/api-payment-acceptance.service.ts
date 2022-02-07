import {environment} from 'src/environments/environment';
import {apiClient, filterEmptyString} from 'src/react/lib/ajax';
import {IMerchantMethod} from './api-payment-acceptance.types';

const BASE_URL = `${environment.paymentAcceptanceApiBaseUrl}/api/payment-acceptance/admin`;

export const getMerchantPaymentMethods = async (merchantId: string) => {
  const {data} = await apiClient.get<IMerchantMethod[]>(`${BASE_URL}/merchant-methods`, {
    params: filterEmptyString({merchantId}),
  });

  return data;
};
