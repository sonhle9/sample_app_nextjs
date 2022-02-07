import {useNotification} from '@setel/portal-ui';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  getBnplAccountDetails,
  updateBnplAccountStatusAndCreditLimit,
} from 'src/react/services/api-bnpl.service';

export const bnplAccountQueryKey = {
  accountListing: 'bnplAccountListing',
  accountDetails: 'bnplAccountDetail',
  accountBills: 'bnplAccountBills',
  accountTransactions: 'bnplAccountTransactions',
};

export const useBnplAccountDetails = (id: string) => {
  return useQuery([bnplAccountQueryKey.accountDetails, id], () => getBnplAccountDetails(id));
};

export const useUpdateStatusAndCreditLimitBnplAccount = () => {
  const queryClient = useQueryClient();
  const setNotify = useNotification();
  return useMutation(updateBnplAccountStatusAndCreditLimit, {
    onError: (err) => {
      setNotify({variant: 'error', title: err.toString()});
    },
    onSuccess: () => queryClient.invalidateQueries(bnplAccountQueryKey.accountDetails),
  });
};
