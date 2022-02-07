import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  cancelBillingSubscriptionsGeneral,
  createBillingSubscriptions,
  createBillingSubscriptionSPAccount,
  editBillingSubscriptionSPAccount,
  getBillingActivityLogs,
  getBillingCreditNoteHistories,
  getBillingInvoiceHistories,
  getBillingSubscription,
  getBillingSubscriptions,
  getSubscriptionSPAccountDetails,
  revertCancelBillingSubscription,
  revertEditBillingSubscription,
  updateBillingSubscriptionsEdit,
  updateBillingSubscriptionsGeneral,
} from './billing-subscriptions.services';
import {HistoryTabLabels} from './billing-subscriptions.constants';
import {IBillingHistory} from './billing-subscriptions.types';

const BillingSubscriptionListingKey = 'BILLING_SUBSCRIPTION_LISTING';
const BillingSubscriptionDetailKey = 'BillingSubscriptionDetail';
const BillingSubscriptionActivityLogs = 'BillingSubscriptionActivityLogs';
const BillingSubscriptionInvoiceHistory = 'BillingSubscriptionInvoiceHistory';
const BillingSubscriptionCreditNoteHistory = 'BillingSubscriptionCreditNoteHistory';
const BillingSmartpayBillingDetailKey = 'BillingSmartpayBillingDetailKey';

export const useBillingSubscriptions = (filter: Parameters<typeof getBillingSubscriptions>[0]) => {
  return useQuery([BillingSubscriptionListingKey, filter], () => getBillingSubscriptions(filter), {
    keepPreviousData: true,
  });
};

export const useCreateBillingSubscription = () => {
  return useMutation((body: Parameters<typeof createBillingSubscriptions>[0]) =>
    createBillingSubscriptions(body),
  );
};

export const useBillingSubscription = (billingSubscriptionId: string) =>
  useQuery([BillingSubscriptionDetailKey, billingSubscriptionId], () =>
    getBillingSubscription(billingSubscriptionId),
  );

export const useUpdateBillingSubscriptionsGeneral = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (body: Parameters<typeof updateBillingSubscriptionsGeneral>[0]) =>
      updateBillingSubscriptionsGeneral(body),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(BillingSubscriptionDetailKey).then();
        queryClient.invalidateQueries(BillingSubscriptionActivityLogs).then();
      },
    },
  );
};

export const useEditBillingSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (body: Parameters<typeof updateBillingSubscriptionsEdit>[0]) =>
      updateBillingSubscriptionsEdit(body),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(BillingSubscriptionDetailKey).then();
        queryClient.invalidateQueries(BillingSubscriptionActivityLogs).then();
        queryClient.invalidateQueries(BillingSubscriptionInvoiceHistory).then();
        queryClient.invalidateQueries(BillingSubscriptionCreditNoteHistory).then();
      },
    },
  );
};

export const useCancelBillingSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (body: Parameters<typeof cancelBillingSubscriptionsGeneral>[0]) =>
      cancelBillingSubscriptionsGeneral(body),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(BillingSubscriptionDetailKey).then();
        queryClient.invalidateQueries(BillingSubscriptionActivityLogs).then();
        queryClient.invalidateQueries(BillingSubscriptionInvoiceHistory).then();
        queryClient.invalidateQueries(BillingSubscriptionCreditNoteHistory).then();
      },
    },
  );
};

export const useRevertCancelBillingSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (billingSubscriptionId: string) => revertCancelBillingSubscription(billingSubscriptionId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(BillingSubscriptionDetailKey).then();
        queryClient.invalidateQueries(BillingSubscriptionActivityLogs).then();
        queryClient.invalidateQueries(BillingSubscriptionInvoiceHistory).then();
        queryClient.invalidateQueries(BillingSubscriptionCreditNoteHistory).then();
      },
    },
  );
};

export const useRevertEditBillingSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (billingSubscriptionId: string) => revertEditBillingSubscription(billingSubscriptionId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(BillingSubscriptionDetailKey).then();
        queryClient.invalidateQueries(BillingSubscriptionActivityLogs).then();
        queryClient.invalidateQueries(BillingSubscriptionInvoiceHistory).then();
        queryClient.invalidateQueries(BillingSubscriptionCreditNoteHistory).then();
      },
    },
  );
};

export const useBillingActivityLogs = (
  filter: Parameters<typeof getBillingActivityLogs>[0],
  subscriptionId: Parameters<typeof getBillingActivityLogs>[1],
) => {
  return useQuery(
    [BillingSubscriptionActivityLogs, filter],
    () => getBillingActivityLogs(filter, subscriptionId),
    {
      keepPreviousData: true,
    },
  );
};

export const useBillingHistory = (filter: IBillingHistory, historyType: string) => {
  if (historyType === HistoryTabLabels.Invoice) {
    return useQuery(
      [BillingSubscriptionInvoiceHistory, filter],
      () => getBillingInvoiceHistories(filter),
      {
        keepPreviousData: true,
      },
    );
  }
  if (historyType === HistoryTabLabels.CreditNote) {
    return useQuery(
      [BillingSubscriptionCreditNoteHistory, filter],
      () => getBillingCreditNoteHistories(filter),
      {
        keepPreviousData: true,
      },
    );
  }
};

export const useSubscriptionSPAccountDetails = (merchantId: string) => {
  return useQuery(
    [BillingSmartpayBillingDetailKey, merchantId],
    () => getSubscriptionSPAccountDetails(merchantId),
    {
      retry: false,
    },
  );
};

export const useCreateBillingSubscriptionSPAccount = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (body: Parameters<typeof createBillingSubscriptionSPAccount>[0]) =>
      createBillingSubscriptionSPAccount(body),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries([BillingSmartpayBillingDetailKey, data.merchantId]);
      },
    },
  );
};

export const useEditBillingSubscriptionSPAccount = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    (body: Parameters<typeof editBillingSubscriptionSPAccount>[1]) =>
      editBillingSubscriptionSPAccount(id, body),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries([BillingSmartpayBillingDetailKey, data.merchantId]);
      },
    },
  );
};
