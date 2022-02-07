import {useQuery} from 'react-query';
import {
  getHourlyTransactionDetail,
  getHourlyTransactionFile,
} from './terminal-switch-hourly-transaction-file.service';

const TERMINAL_SWITCH_HOURLY_TRANSACTION_FILE = 'hourly_transaction_file';
const TERMINAL_SWITCH_HOURLY_TRANSACTION_DETAIL = 'hourly_transaction_detail';

export const useHourlyTransactionFile = (
  filter: Parameters<typeof getHourlyTransactionFile>[0],
) => {
  return useQuery([TERMINAL_SWITCH_HOURLY_TRANSACTION_FILE, filter], async () =>
    getHourlyTransactionFile(filter),
  );
};

export const useHourlyTransactionFileDetail = (id: string) => {
  return useQuery([TERMINAL_SWITCH_HOURLY_TRANSACTION_DETAIL, id], async () =>
    getHourlyTransactionDetail(id),
  );
};
