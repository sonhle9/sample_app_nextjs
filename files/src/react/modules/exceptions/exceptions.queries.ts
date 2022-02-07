import {useQuery} from 'react-query';
import {searchMerchantsWithNameOrID} from 'src/react/services/api-merchants.service';
import {IIndexMerchantFilters} from 'src/react/services/api-merchants.type';
import {
  getExceptionDetails,
  getExceptionTransactions,
  getExceptions,
} from 'src/react/services/api-settlements.service';

const EXCEOPTIONS = 'exceptions';
const EXCEOPTIONDETAILS = 'ExceptionDetails';
const EXCEOPTIONTRANSACTION = 'ExceptionTransactions';
const MERCHANTS = 'merchants';

export const useExceptions = (filter: Parameters<typeof getExceptions>[0]) => {
  return useQuery([EXCEOPTIONS, filter], () => getExceptions(filter));
};

export const useExceptionDetails = (filter: Parameters<typeof getExceptionDetails>[0]) =>
  useQuery([EXCEOPTIONDETAILS, filter], () => getExceptionDetails(filter));

export const useExceptionTransactions = (filter: Parameters<typeof getExceptionTransactions>[0]) =>
  useQuery([EXCEOPTIONTRANSACTION, filter], () => getExceptionTransactions(filter));

export const useGetMerchants = (filter: IIndexMerchantFilters) => {
  return useQuery([MERCHANTS, filter], () => searchMerchantsWithNameOrID(filter), {
    select: (result) =>
      result.map((merchant) => ({
        value: merchant.merchantId,
        label: merchant.name,
        metadata: merchant.merchantId,
      })),
  });
};
