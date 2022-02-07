import {useQuery, useQueryClient} from 'react-query';
import {
  getPayoutsBatch,
  getPayoutsBatchDetails,
  getPayoutsByBatchId,
} from 'src/react/services/api-processor.service';

export const usePayouts = (
  pagination: Omit<Parameters<typeof getPayoutsBatch>[0], 'from' | 'to'> & {
    range: [string, string];
  },
) => {
  const queryClient = useQueryClient();
  return useQuery(
    [CACHE_KEYS.Payouts, pagination],
    () => {
      const {
        range: [from, to],
        ...filter
      } = pagination;
      return getPayoutsBatch({...filter, from, to});
    },
    {
      onSuccess: (data) => {
        if (data && data.items) {
          data.items.forEach((payoutBatch) =>
            queryClient.setQueryData([CACHE_KEYS.PayoutDetails, payoutBatch.id], payoutBatch),
          );
        }
      },
      keepPreviousData: true,
    },
  );
};

export const usePayoutsDetails = (id: string) => {
  return useQuery([CACHE_KEYS.PayoutDetails, id], () => getPayoutsBatchDetails(id));
};

export const usePayoutByBatchId = (pagination: Parameters<typeof getPayoutsByBatchId>[0]) => {
  return useQuery([CACHE_KEYS.Payouts, pagination], () => getPayoutsByBatchId(pagination), {
    keepPreviousData: true,
  });
};

const CACHE_KEYS = {
  Payouts: '_PAYOUTS',
  PayoutDetails: 'PayoutDetails',
};
