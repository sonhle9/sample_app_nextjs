import {useQuery} from 'react-query';
import {searchMerchantsWithNameOrID} from 'src/react/services/api-merchants.service';
import {IIndexMerchantFilters} from 'src/react/services/api-merchants.type';
import {
  getReconciliations,
  getReconciliationDetail,
} from 'src/react/services/api-settlements.service';

const RECONCILIATIONS = 'reconciliations';
const RECONCILIATIONDETAILS = 'reconciliationsDetails';

export const useReconciliations = (filter: Parameters<typeof getReconciliations>[0]) => {
  return useQuery([RECONCILIATIONS, filter], () => getReconciliations(filter), {
    keepPreviousData: true,
  });
};

export const useReconciliationDetails = (filter: Parameters<typeof getReconciliationDetail>[0]) =>
  useQuery([RECONCILIATIONDETAILS, filter], () => getReconciliationDetail(filter));

export const useGetMerchants = (filter: IIndexMerchantFilters) => {
  return useQuery(['merchants', filter], () => searchMerchantsWithNameOrID(filter), {
    keepPreviousData: true,
    select: (result) =>
      result.map((merchant) => ({
        value: merchant.merchantId,
        label: merchant.name,
        metadata: merchant.merchantId,
      })),
  });
};
