import {useQuery} from 'react-query';
import {searchMerchantsWithNameOrID} from 'src/react/services/api-merchants.service';
import {IIndexMerchantFilters} from 'src/react/services/api-merchants.type';
import {
  getAcquirerDetails,
  getAcquirers,
  getTerminalDetails,
  getTerminals,
} from './terminals.service';

const TERMINALS = 'terminals';
const TERMINALS_DETAILS = 'terminals_details';
const TERMINALS_BY_MERCHANT = 'terminals_by_merchants';
export const ACQUIRERS = 'acquirers';
export const ACQUIRER_DETAIL = 'acquirer_detail';

interface QueryOptions {
  enabled: boolean;
}
export const useTerminals = (filter: Parameters<typeof getTerminals>[0] & QueryOptions) => {
  return useQuery([TERMINALS, filter], () => getTerminals(filter), {enabled: filter.enabled});
};

export const useTerminalsDetails = (filter: Parameters<typeof getTerminalDetails>[0]) =>
  useQuery([TERMINALS_DETAILS, filter], () => getTerminalDetails(filter));

export const useGetTerminalsByMerchant = (filter: Parameters<typeof getTerminals>[0]) => {
  return useQuery(
    [TERMINALS_BY_MERCHANT, filter],
    () => {
      const res = getTerminals(filter).then((value) => {
        return value.terminals.map(({terminalId}) => {
          return {
            value: terminalId,
            label: terminalId,
          };
        });
      });
      return res;
    },
    {
      keepPreviousData: true,
    },
  );
};

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

export const useIndexAcquirers = (filter: Parameters<typeof getAcquirers>[0]) =>
  useQuery([ACQUIRERS, filter], () => getAcquirers(filter));

export const useAcquirerDetails = (filter: Parameters<typeof getAcquirerDetails>[0]) =>
  useQuery([ACQUIRER_DETAIL, filter], () => getAcquirerDetails(filter));
