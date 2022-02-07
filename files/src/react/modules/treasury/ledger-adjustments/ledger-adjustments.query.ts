import {useQuery, useQueryClient} from 'react-query';
import {getLedgerAdjustment, getLedgerAdjustments} from 'src/react/services/api-ledger.service';

export const useLedgerAdjustments = (
  pagination: Omit<Parameters<typeof getLedgerAdjustments>[0], 'from' | 'to'> & {
    range: [string, string];
  },
) => {
  const queryClient = useQueryClient();
  return useQuery(
    [CACHE_KEYS.Adjustments, pagination],
    () => {
      const {
        range: [from, to],
        ...filter
      } = pagination;
      return getLedgerAdjustments({...filter, from, to});
    },
    {
      onSuccess: (data) => {
        if (data && data.items) {
          data.items.forEach((report) => {
            queryClient.setQueryData([CACHE_KEYS.AdjustmentDetails, report.id], report);
          });
        }
      },
      keepPreviousData: true,
    },
  );
};

export const useLedgerAdjustmentDetails = (id: string) => {
  return useQuery([CACHE_KEYS.AdjustmentDetails, id], () => getLedgerAdjustment(id));
};

const CACHE_KEYS = {
  Adjustments: 'ADJUSTMENTS',
  AdjustmentDetails: 'ADJUSTMENT_DETAILS',
};
