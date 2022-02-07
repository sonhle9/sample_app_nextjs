import {apiClient} from 'src/react/lib/ajax';
import {environment} from 'src/environments/environment';
import {fetchPaginatedData, getData, IPaginationParam} from '../lib/ajax';
import {
  GeneralLedgerPayoutsStatus,
  Mt940TransactionTypes,
  PayoutBatchStatus,
} from './api-processor.enum';
import {
  IGeneralLedgerPayoutsBatch,
  IGeneralLedgerPayoutsBatchPayout,
  IPayoutsBatch,
  IPayout,
  IMT940,
  IMT940ReportTransaction,
  IPayoutProjection,
  IPayoutMax,
  IMessageMT490Sync,
} from './api-processor.type';

const BASE_URL = `${environment.processorApiBaseUrl}/api/processor`;

export const getGeneralLedgerPayoutsBatch = (
  pagination: IPaginationParam & {
    status: GeneralLedgerPayoutsStatus;
    from: string;
    to: string;
  },
) =>
  fetchPaginatedData<IGeneralLedgerPayoutsBatch>(`${BASE_URL}/pdb/admin/payouts-batch`, pagination);

export const getGeneralLedgerPayoutsBatchDetails = (id: string) =>
  getData<IGeneralLedgerPayoutsBatch>(`${BASE_URL}/pdb/admin/payouts-batch/${id}`);

export const getGeneralLedgerPayoutsByBatchId = (
  pagination: IPaginationParam & {batchId: string; status: string},
) =>
  fetchPaginatedData<IGeneralLedgerPayoutsBatchPayout>(
    `${BASE_URL}/pdb/admin/payouts-batch/${pagination.batchId}/payouts`,
    pagination,
  );

export const getGeneralLedgerPayoutsBatchCSV = (status: string, from: string, to: string) =>
  getData<string>(`${BASE_URL}/pdb/admin/payouts/inBatch`, {
    headers: {
      accept: 'text/csv',
    },
    params: {
      from,
      to,
      status,
    },
  });

export const getPayoutsBatch = (
  pagination: IPaginationParam & {
    status: PayoutBatchStatus;
    from: string;
    to: string;
  },
) => fetchPaginatedData<IPayoutsBatch>(`${BASE_URL}/admin/payouts-batch`, pagination);

export const getPayoutsBatchDetails = (id: string) =>
  getData<IPayoutsBatch>(`${BASE_URL}/admin/payouts-batch/${id}`);

export const getPayoutsByBatchId = (
  pagination: IPaginationParam & {batchId: string; status: string},
) =>
  fetchPaginatedData<IPayout>(
    `${BASE_URL}/admin/payouts-batch/${pagination.batchId}/payouts`,
    pagination,
  );

export const getPayoutsCSV = (status: string, [from, to]: [string, string]) =>
  getData<string>(`${BASE_URL}/admin/payouts/inBatch`, {
    headers: {
      accept: 'text/csv',
    },
    params: {
      from,
      to,
      status,
    },
  });

export const getPayoutsDetailsCSV = (payoutBatchId: string, status: string) =>
  getData<string>(`${BASE_URL}/admin/payouts`, {
    headers: {
      accept: 'text/csv',
    },
    params: {
      payoutBatchId,
      status,
    },
  });

export const getGLPayoutsDetailsCSV = (payoutBatchId: string, status: string) =>
  getData<string>(`${BASE_URL}/pdb/admin/payouts`, {
    headers: {
      accept: 'text/csv',
    },
    params: {
      payoutBatchId,
      status,
    },
  });

export const getMT940Reports = (
  pagination: IPaginationParam & {
    account: 'COLLECTION' | 'OPERATING';
    from: string;
    to: string;
  },
) => fetchPaginatedData<IMT940>(`${BASE_URL}/mt940/index`, pagination);

export const getMT940ReportsCSV = (account: string, from: string, to: string) =>
  getData<string>(`${BASE_URL}/mt940/index`, {
    headers: {
      accept: 'text/csv',
    },
    params: {
      account,
      from,
      to,
    },
  });

export const getMT940Report = (id: string) => getData<IMT940>(`${BASE_URL}/mt940/${id}`);

export const syncMT940Report = (id: string) => {
  return apiClient.put<IMessageMT490Sync>(`${BASE_URL}/mt940/${id}/sync`);
};

export const getMT940ReportTransactions = (
  id: string,
  filters: {transactionType?: Mt940TransactionTypes},
) =>
  getData<IMT940ReportTransaction[]>(`${BASE_URL}/mt940/${id}/transactions`, {
    params: filters,
  });

export const getMT940ReportTransactionsCSV = (
  id: string,
  transactionType?: Mt940TransactionTypes,
) =>
  getData<string>(`${BASE_URL}/mt940/${id}/transactions`, {
    headers: {
      accept: 'text/csv',
    },
    params: {
      transactionType,
    },
  });

export const getMT940ReportTransactionsTXT = (id: string) =>
  getData<string>(`${BASE_URL}/mt940/${id}/download`, {
    headers: {
      accept: 'text/plain',
    },
  });

export const getPayoutProjection = async (referenceDate: string) => {
  const {data: listPayout} = await apiClient.get<IPayoutProjection[]>(
    `${BASE_URL}/admin/payouts/projection`,
    {
      params: {
        referenceDate,
      },
    },
  );

  const DAYS_BEFORE = 3;
  const DAYS_AFTER = 7;
  const currentIndex = listPayout.findIndex((day) => day.isReference);

  const payouts = listPayout.map((date, i) => {
    const projectionBase = currentIndex !== -1 && i >= currentIndex ? listPayout[i - 7] : date; // if today or future date, use last week data
    return {
      ...date,
      totalAmount: projectionBase.totalAmount,
      totalFees: projectionBase.totalFees,
      preText: i < currentIndex ? 'Payout' : i === currentIndex ? 'Reference' : 'Projected',
    };
  });

  return currentIndex !== -1
    ? payouts.slice(currentIndex - DAYS_BEFORE, currentIndex + DAYS_AFTER)
    : payouts;
};

export const getConsecutiveOffDays = (payouts) => {
  let result = 0;
  const currentIndex = payouts.findIndex((d) => d.isReference);
  let dayIndex = currentIndex !== -1 ? currentIndex + 1 : undefined;
  while (dayIndex && (payouts[dayIndex].isHoliday || payouts[dayIndex].isWeekend)) {
    result++;
    dayIndex++;
  }
  return result;
};

export const calculateProjectedAmount = (
  maxPayout,
  numOfHolidayOrWeekend,
  bufferDays: number = 0,
  discretionaryBuffer: number = 0,
) => {
  return (numOfHolidayOrWeekend + 1 + bufferDays) * maxPayout * (1 + discretionaryBuffer / 100);
};

export const getPayoutMax = async () => {
  const {data: payoutMax} = await apiClient.get<IPayoutMax>(`${BASE_URL}/admin/payouts/max`);
  return payoutMax;
};

export const getReconFileCSV = (vendor: string, reconType: string, date: string) =>
  apiClient.get<string>(`${BASE_URL}/${vendor}/eod/download`, {
    headers: {
      accept: 'text/csv',
    },
    params: {
      reconType,
      date,
    },
  });
