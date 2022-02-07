import {useQuery} from 'react-query';
import {getLedgerTransaction, getLedgerTransactions} from 'src/react/services/api-ledger.service';

export const useLedgerTransactions = (
  pagination: Omit<Parameters<typeof getLedgerTransactions>[0], 'from' | 'to'> & {
    range: [string, string];
  },
) => {
  return useQuery(
    [CACHE_KEYS.ledgerTransactions, pagination],
    () => {
      const {
        range: [from, to],
        ...filter
      } = pagination;
      return getLedgerTransactions({...filter, from, to});
    },
    {
      keepPreviousData: true,
    },
  );
};

export const useLedgerTransactionsDetails = (id: string) => {
  return useQuery([CACHE_KEYS.ledgerTransactionsDetails, id], () => getLedgerTransaction(id));
};

const CACHE_KEYS = {
  ledgerTransactions: 'LEDGER_TRANSACTIONS',
  ledgerTransactionsDetails: 'LEDGER_TRANSACTIONS_DETAILS',
};
