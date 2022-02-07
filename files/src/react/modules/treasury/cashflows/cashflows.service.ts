import {environment} from 'src/environments/environment';
import {apiClient} from 'src/react/lib/ajax';
import {AggregatesAccounts, PlatformAccounts} from './shared/cashflows.enum';
import {
  IAccount,
  IAdjustBufferInput,
  IPlatformAccounts,
  IPlatformAdjustInput,
  ITransferAccountInput,
} from './shared/cashflows.interface';

const cashflowsPlatformUrl = `${environment.ledgerApiBaseUrl}/api/ledger/accounts/platform`;
const cashflowsAggregatesUrl = `${environment.ledgerApiBaseUrl}/api/ledger/accounts/aggregates`;
const cashflowsDailyMerchantPayoutUrl = `${environment.ledgerApiBaseUrl}/api/processor/admin/payouts-batch/today-summary`;
const cashflowsAdjustAccount = `${environment.ledgerApiBaseUrl}/api/ledger/accounts/platform/adjust`;
const cashflowsModalTransferToOperatingAccount = `${environment.ledgerApiBaseUrl}/api/ledger/accounts/transfer`;
const cashflowsAdjustBuffer = `${environment.ledgerApiBaseUrl}/api/ledger/accounts/buffer/adjust`;

export const getPlatformAccounts = async () => {
  const {data: platformData} = await apiClient.get(cashflowsPlatformUrl);
  const platformAccounts: IPlatformAccounts = {
    collection: null,
    trust: null,
    operating: null,
    operatingCollection: null,
  };

  platformData.forEach((account) => {
    Object.keys(PlatformAccounts).forEach((key) => {
      if (account.userId === PlatformAccounts[key]) {
        platformAccounts[key] = account;
      }
    });
  });

  return platformAccounts;
};

export const getDailyMerchantPayout = async () => {
  const {data: todaySummary} = await apiClient.get(cashflowsDailyMerchantPayoutUrl);
  return todaySummary;
};

export const getAggregatesBalances = async () => {
  const {data: listAccount} = await apiClient.get(cashflowsAggregatesUrl);

  const trustAccounts = [
    {
      account: AggregatesAccounts.customer,
      label: 'Total customer prepayments',
      balanceType: 'availableBalance',
    },
    {
      account: AggregatesAccounts.merchant,
      label: 'Total merchant payables',
      balanceType: 'availableBalance',
    },
    {
      account: AggregatesAccounts.merchant,
      label: 'Total merchant prepaid',
      balanceType: 'prepaidBalance',
    },
    {
      account: AggregatesAccounts.buffer,
      label: 'Buffer',
      balanceType: 'availableBalance',
      editable: true,
    },
    {account: AggregatesAccounts.mdr, label: 'MDR', balanceType: 'availableBalance'},
  ] as any[];

  const operatingCollectionAggregatesAccounts: Array<{
    account: AggregatesAccounts;
    label: string;
    balanceType: 'availableBalance';
    details?: IAccount;
  }> = [
    {
      account: AggregatesAccounts.merchantOperating,
      label: 'Total merchant payables',
      balanceType: 'availableBalance',
    },
    {
      account: AggregatesAccounts.mdrOperating,
      label: 'MDR',
      balanceType: 'availableBalance',
    },
  ];

  listAccount.forEach((account) => {
    trustAccounts.forEach((value, index) => {
      if (value.account === account.userId || value.account.userId === account.userId) {
        trustAccounts[index].account = account;
      }
    });
    operatingCollectionAggregatesAccounts.forEach((value, index) => {
      if (value.account === account.userId) {
        operatingCollectionAggregatesAccounts[index].details = account;
      }
    });
  });

  return {trustAccounts, operatingCollectionAggregatesAccounts};
};

export const adjustCollectionAccount = async (collectionAccount: IPlatformAdjustInput) => {
  return apiClient
    .post<IPlatformAdjustInput>(cashflowsAdjustAccount, collectionAccount)
    .then((res) => res.data);
};

export const adjustOperatingAccount = async (operatingAccount: IPlatformAdjustInput) => {
  return apiClient
    .post<IPlatformAdjustInput>(cashflowsAdjustAccount, operatingAccount)
    .then((res) => res.data);
};

export const transferToOperatingAccount = async (transferAccount: ITransferAccountInput) => {
  return apiClient
    .post<IPlatformAdjustInput>(cashflowsModalTransferToOperatingAccount, transferAccount)
    .then((res) => res.data);
};

export const adjustBufferAvailable = async (bufferAvailable: IAdjustBufferInput) => {
  return apiClient
    .post<IAdjustBufferInput>(cashflowsAdjustBuffer, bufferAvailable)
    .then((res) => res.data);
};
