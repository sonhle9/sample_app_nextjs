import {useQuery} from 'react-query';
import {getMerchants, getMerchantsSmartpay} from './merchants.service';

export const useMerchants = (filter: Parameters<typeof getMerchants>[0]) => {
  return useQuery(['MerchantSearch', filter], () => getMerchants(filter), {
    keepPreviousData: true,
  });
};

export const useMerchantsSmartPay = (filter: Parameters<typeof getMerchantsSmartpay>[0]) => {
  return useQuery(['MerchantsSmartSearch', filter], () => getMerchantsSmartpay(filter), {
    keepPreviousData: true,
  });
};
