import {useQuery, useQueryClient} from 'react-query';
import {
  getDailySummary,
  getReceivablesDetails,
  indexReceivableExceptions,
  indexReceivableReconciliations,
  indexReceivables,
} from 'src/react/services/api-ledger.service';
import {
  IReceivable,
  IReceivableException,
  IReceivableReconciliation,
} from 'src/react/services/api-ledger.type';

export const useReceivables = (
  pagination: Omit<Parameters<typeof indexReceivables>[0], 'from' | 'to'> & {
    range: [string, string];
  },
) => {
  const setReceivablesDetails = useSetReceivablesDetails();

  const {
    range: [from, to],
    ...filter
  } = pagination;

  return useQuery(
    [CACHE_KEYS.RECEIVABLES, pagination],
    () => indexReceivables({...filter, from, to}),
    {
      onSuccess: (data) => {
        if (data && data.items) {
          data.items.forEach(setReceivablesDetails);
        }
      },
      keepPreviousData: true,
    },
  );
};

export const useReceivablesDetails = (id: string) =>
  useQuery([CACHE_KEYS.RECEIVABLE, id], () => getReceivablesDetails(id));

export const useReceivableExceptions = (
  id: string,
  pagination: Parameters<typeof indexReceivableExceptions>[1],
) => {
  const setReceivableExceptions = useSetReceivableExceptions();

  return useQuery(
    [CACHE_KEYS.RECEIVABLE_EXCEPTIONS, pagination],
    () => indexReceivableExceptions(id, pagination),
    {
      onSuccess: (data) => {
        if (data && data.items) {
          data.items.forEach(setReceivableExceptions);
        }
      },
      keepPreviousData: true,
    },
  );
};

export const useReceivableReconciliations = (
  id: string,
  pagination: Parameters<typeof indexReceivableReconciliations>[1],
) => {
  const setReceivableReconciliations = useSetReceivablesReconciliations();

  return useQuery(
    [CACHE_KEYS.RECEIVABLE_TRANSACTIONS, pagination],
    () => indexReceivableReconciliations(id, pagination),
    {
      onSuccess: (data) => {
        if (data && data.items) {
          data.items.forEach(setReceivableReconciliations);
        }
      },
      keepPreviousData: true,
    },
  );
};

export const useDailySummary = (filters: {paymentGatewayVendor: string; transactionDate: string}) =>
  useQuery([CACHE_KEYS.DAILY_SUMMARY, filters], () => getDailySummary(filters));

const useSetReceivablesDetails = () => {
  const queryClient = useQueryClient();
  return function setReceivablesDetails(data: IReceivable) {
    queryClient.setQueryData([CACHE_KEYS.RECEIVABLE, data.id], data);
  };
};

const useSetReceivableExceptions = () => {
  const queryClient = useQueryClient();
  return function setReceivableExceptions(data: IReceivableException) {
    queryClient.setQueryData([CACHE_KEYS.RECEIVABLE_EXCEPTIONS, data.metadata.transId], data);
  };
};

const useSetReceivablesReconciliations = () => {
  const queryClient = useQueryClient();
  return function setReceivableReconciliation(data: IReceivableReconciliation) {
    queryClient.setQueryData([CACHE_KEYS.RECEIVABLE_TRANSACTIONS, data.transactionId], data);
  };
};

const CACHE_KEYS = {
  RECEIVABLES: 'RECEIVABLES',
  RECEIVABLE_EXCEPTIONS: 'RECEIVABLE_EXCEPTIONS',
  RECEIVABLE_TRANSACTIONS: 'RECEIVABLE_TRANSACTIONS',
  RECEIVABLE: 'RECEIVABLE',
  DAILY_SUMMARY: 'DAILY_SUMMARY',
};
