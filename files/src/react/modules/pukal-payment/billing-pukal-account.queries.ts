import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  clearPukalAccount,
  createPukalAccount,
  getPukalAccountDetails,
  readMerchant,
  updatePukalAccount,
} from './billing-pukal-account.services';

const BillingPukalAccountDetailKey = 'BillingPukalAccountDetail';
const BillingMerchantPukalDetailKey = 'PukalMerchantDetail';

export const useCreatePukalAccount = () => {
  const queryClient = useQueryClient();

  return useMutation((body: Parameters<typeof createPukalAccount>[0]) => createPukalAccount(body), {
    onSuccess: () => {
      queryClient.invalidateQueries([BillingPukalAccountDetailKey]);
      queryClient.invalidateQueries([BillingMerchantPukalDetailKey]);
    },
  });
};

export const useUpdatePukalAccount = () => {
  const queryClient = useQueryClient();

  return useMutation((body: Parameters<typeof updatePukalAccount>[0]) => updatePukalAccount(body), {
    onSuccess: () => {
      queryClient.invalidateQueries([BillingPukalAccountDetailKey]);
      queryClient.invalidateQueries([BillingMerchantPukalDetailKey]);
    },
  });
};

export const useClearPukalAccount = () => {
  const queryClient = useQueryClient();

  return useMutation((merchantId: string) => clearPukalAccount(merchantId), {
    onSuccess: () => {
      queryClient.invalidateQueries([BillingPukalAccountDetailKey]);
      queryClient.invalidateQueries([BillingMerchantPukalDetailKey]);
    },
  });
};
export const usePukalAccountDetails = (merchantId: string) => {
  return useQuery([BillingPukalAccountDetailKey, merchantId], () =>
    getPukalAccountDetails(merchantId),
  );
};

export const useMerchantDetails = (merchantId: string) => {
  return useQuery([BillingMerchantPukalDetailKey, merchantId], () => readMerchant(merchantId));
};
