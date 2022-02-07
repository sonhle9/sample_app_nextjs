import {useQuery} from 'react-query';
import {
  getTerminalSwitchTransactionDetail,
  getTransactions,
} from './terminal-switch-transaction.service';

const TERMINAL_SWITCH_TRANSACTIONS = 'switch_transactions';
const TERMINAL_SWITCH_TRANSACTIONS_DETAIl = 'switch_transactions_detail';

export const useSwitchTransaction = (filter: Parameters<typeof getTransactions>[0]) => {
  return useQuery([TERMINAL_SWITCH_TRANSACTIONS, filter], async () => getTransactions(filter));
};

export const useSwitchTransactionDetail = (
  filter: Parameters<typeof getTerminalSwitchTransactionDetail>[0],
) => {
  return useQuery([TERMINAL_SWITCH_TRANSACTIONS_DETAIl, filter], async () =>
    getTerminalSwitchTransactionDetail(filter),
  );
};
