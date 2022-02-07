import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  getAggregatesBalances,
  getDailyMerchantPayout,
  getPlatformAccounts,
  transferToOperatingAccount,
  adjustBufferAvailable,
  adjustOperatingAccount,
  adjustCollectionAccount,
} from './cashflows.service';
import {
  IAdjustBufferInput,
  IPlatformAdjustInput,
  ITransferAccountInput,
} from './shared/cashflows.interface';

const CACHE_KEYS = {
  CashflowsAdjustCollectionAccount: 'CASHFLOWS_ADJUST_COLLECTION_ACCOUNT',
  CashflowsAdjustOperatingAccount: 'CASHFLOWS_ADJUST_OPERATING_ACCOUNT',
  CashflowsAdjustBufferAvailable: 'CASHFLOWS_ADJUST_BUFFER_AVAILABLE',
  CashflowsTransferToOperation: 'CASHFLOWS_TRANSFER_TO_OPERATION',
  CashflowsPlatformAccounts: 'CASHFLOWS_PLATFORM_ACCOUNTS',
  CashflowsTrustAccount: 'CASHFLOWS_TRUST_ACCOUNT',
  CashflowsDailyMerchantPayout: 'CASHFLOWS_DAILY_MERCHANT_PAYOUT',
};

export const usePlatformAccounts = () => {
  return useQuery([CACHE_KEYS.CashflowsPlatformAccounts], () => getPlatformAccounts(), {
    keepPreviousData: true,
    refetchIntervalInBackground: false,
    refetchInterval: false,
  });
};

export const useAggregatesBalances = () => {
  return useQuery([CACHE_KEYS.CashflowsTrustAccount], () => getAggregatesBalances(), {
    keepPreviousData: true,
    refetchIntervalInBackground: false,
    refetchInterval: false,
  });
};

export const useDailyMerChantPayout = () => {
  return useQuery([CACHE_KEYS.CashflowsDailyMerchantPayout], () => getDailyMerchantPayout(), {
    keepPreviousData: true,
    refetchIntervalInBackground: false,
    refetchInterval: false,
  });
};

export const useAdjustCollectionAccount = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (collectionAccount: IPlatformAdjustInput) => adjustCollectionAccount(collectionAccount),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CACHE_KEYS.CashflowsAdjustCollectionAccount]);
      },
      onSettled: () => {
        queryClient.invalidateQueries(CACHE_KEYS.CashflowsPlatformAccounts);
      },
    },
  );
};

export const useAdjustOperatingAccount = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (operatingAccount: IPlatformAdjustInput) => adjustOperatingAccount(operatingAccount),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CACHE_KEYS.CashflowsAdjustOperatingAccount]);
      },
      onSettled: () => {
        queryClient.invalidateQueries(CACHE_KEYS.CashflowsPlatformAccounts);
      },
    },
  );
};

export const useTransferToOperatingAccount = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (transferAccount: ITransferAccountInput) => transferToOperatingAccount(transferAccount),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CACHE_KEYS.CashflowsTransferToOperation]);
      },
      onSettled: () => {
        queryClient.invalidateQueries(CACHE_KEYS.CashflowsPlatformAccounts);
      },
    },
  );
};

export const useAdjustBufferAvailable = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (bufferAvailable: IAdjustBufferInput) => adjustBufferAvailable(bufferAvailable),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CACHE_KEYS.CashflowsAdjustBufferAvailable]);
      },
      onSettled: () => {
        queryClient.invalidateQueries(CACHE_KEYS.CashflowsPlatformAccounts);
        queryClient.invalidateQueries(CACHE_KEYS.CashflowsTrustAccount);
      },
    },
  );
};
