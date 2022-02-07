import {useMutation, useQuery, useQueryClient} from 'react-query';
import {SETEL_MERCHANT_ID} from 'src/app/merchants/shared/constants';
import {createAdjustmentTransaction} from '../../merchants/merchants.service';
import {
  addSetelFundsFromBuffer,
  addPrefundingBalanceAlert,
  createTopUpPrepaid,
  deletePrefundingBalanceAlert,
  getAggregatesBalances,
  getPrefundingBalancesAlert,
  getPrefundingBalancesSummary,
  readMerchantBalances,
} from '../prefunding-balance/prefunding-balance.service';
import {
  ICreateAdjustmentTransactionData,
  PrefundingBalanceAlertType,
} from './shared/prefunding-balance.type';

export const usePrefundingBalancesAlert = (
  pagination: Parameters<typeof getPrefundingBalancesAlert>[0],
) => {
  const queryClient = useQueryClient();
  return useQuery(
    [CACHE_KEYS.PrefundingBalancesAlert, pagination],
    () => {
      return getPrefundingBalancesAlert(pagination);
    },
    {
      onSuccess: (data) => {
        if (data && data.items) {
          data.items.forEach((report) => {
            queryClient.setQueryData([CACHE_KEYS.PrefundingBalanceAlert, report.id], report);
          });
        }
      },
      keepPreviousData: true,
    },
  );
};

export const useAddPrefundingBalanceAlert = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (prefundingBalanceAlert: PrefundingBalanceAlertType) =>
      addPrefundingBalanceAlert(prefundingBalanceAlert),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CACHE_KEYS.PrefundingBalanceAddAlert]);
      },
      onSettled: () => {
        queryClient.invalidateQueries(CACHE_KEYS.PrefundingBalancesAlert);
      },
    },
  );
};

export const useDeleteAlert = () => {
  const queryClient = useQueryClient();
  return useMutation((prefundingBalanceId) => deletePrefundingBalanceAlert(prefundingBalanceId), {
    onSuccess: () => {
      queryClient.invalidateQueries([CACHE_KEYS.PrefundingBalanceDeleteAlert]);
    },
    onSettled: () => {
      queryClient.invalidateQueries(CACHE_KEYS.PrefundingBalancesAlert);
    },
  });
};

export const usePrefundingBalancesSummary = (
  pagination: Parameters<typeof getPrefundingBalancesSummary>[0],
) => {
  const queryClient = useQueryClient();
  return useQuery(
    [CACHE_KEYS.PrefundingBalancesSummary, pagination],
    () => {
      return getPrefundingBalancesSummary(pagination);
    },
    {
      onSuccess: (data) => {
        if (data && data.items) {
          data.items.forEach((report) => {
            queryClient.setQueryData([CACHE_KEYS.PrefundingBalanceSummary, report.id], report);
          });
        }
      },
      keepPreviousData: true,
    },
  );
};

export const useAddFundFromBuffer = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (adjustmentData: Omit<ICreateAdjustmentTransactionData, 'merchantId'>) =>
      addSetelFundsFromBuffer({
        ...adjustmentData,
        merchantId: SETEL_MERCHANT_ID,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CACHE_KEYS.PrefundingBalanceAdjustBuffer]);
      },
      onSettled: () => {
        queryClient.invalidateQueries(CACHE_KEYS.PrefundingBalanceMerchantBalance);
      },
    },
  );
};

export const useCreateAdjustmentTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (adjustmentData: Omit<ICreateAdjustmentTransactionData, 'merchantId'>) =>
      createAdjustmentTransaction({
        ...adjustmentData,
        merchantId: SETEL_MERCHANT_ID,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([CACHE_KEYS.PrefundingBalanceCreateAdjustmentTransaction]);
      },
    },
  );
};

export const useCreateTopUpPrepaid = () => {
  const queryClient = useQueryClient();
  return useMutation((dataTopup: any) => createTopUpPrepaid(dataTopup), {
    onSuccess: () => {
      queryClient.invalidateQueries([CACHE_KEYS.PrefundingBalanceCreateTopUpPrepaid]);
    },
  });
};

export const useMerchantBalances = () => {
  return useQuery(
    [CACHE_KEYS.PrefundingBalanceMerchantBalance],
    () => readMerchantBalances(SETEL_MERCHANT_ID),
    {
      keepPreviousData: true,
    },
  );
};

export const useAggregatesBalances = () => {
  return useQuery([CACHE_KEYS.PrefundingBalanceBufferData], () => getAggregatesBalances(), {
    keepPreviousData: true,
    refetchIntervalInBackground: false,
    refetchInterval: false,
  });
};

const CACHE_KEYS = {
  PrefundingBalancesAlert: 'Prefunding Balances Alert',
  PrefundingBalanceAlert: 'Prefunding Balance Alert',
  PrefundingBalanceAddAlert: 'Prefunding Balance Add Alert',
  PrefundingBalanceDeleteAlert: 'Prefunding Balance Delete Alert',
  PrefundingBalancesSummary: 'Prefunding Balances Summary',
  PrefundingBalanceSummary: 'Prefunding Balance Summary',
  PrefundingBalance: 'Prefunding Balance',
  PrefundingBalanceAdjustBuffer: 'Prefunding Balance Adjust Buffer',
  PrefundingBalanceCreateAdjustmentTransaction: 'Prefunding Balance Create Adjustment Transaction',
  PrefundingBalanceCreateTopUpPrepaid: 'Prefunding Balance Create Top Up Prepaid',
  PrefundingBalanceMerchantBalance: 'Prefunding Balance Merchant Balance',
  PrefundingBalanceBufferData: 'Prefunding Balance Buffer Data',
};
