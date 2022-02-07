import {useMutation, UseMutationOptions, useQuery} from 'react-query';
import {searchMerchantsWithNameOrID} from 'src/react/services/api-merchants.service';
import {IIndexMerchantFilters} from 'src/react/services/api-merchants.type';
import {getTxNBatchSummary} from './terminal-switch-tx-n-batch-summary.service';

export const TERMINAL_SWITCH_TX_N_BATCH_SUMMARY = 'terminal_switch_tx_n_batch_summary';

export const useTxNBatchSummaryLazy = (
  options?: UseMutationOptions<any, any, Parameters<typeof getTxNBatchSummary>[0]>,
) => {
  return useMutation(
    [TERMINAL_SWITCH_TX_N_BATCH_SUMMARY],
    (filter: Parameters<typeof getTxNBatchSummary>[0]) => getTxNBatchSummary(filter),
    options,
  );
};

export const useGetMerchants = (filter: IIndexMerchantFilters) => {
  return useQuery(['merchants', filter], () => searchMerchantsWithNameOrID(filter), {
    keepPreviousData: true,
    select: (result) =>
      result.map((merchant) => ({
        value: merchant.merchantId,
        label: merchant.name,
        description: merchant.merchantId,
      })),
  });
};
