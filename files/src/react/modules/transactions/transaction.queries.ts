import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  getTransactions,
  downloadTransaction,
  sendEmail,
  getTransactionDetails,
  getMerChants,
  getRelatedTransactions,
  getLoyaltyCategories,
  releaseAuthTransaction,
  sendEmailByHolistic,
  getTransactionWithRequestID,
  getCardDetails,
  getFleetTransactionDetails,
  getRelatedFleetTransactions,
  getReloadsFleetTransactionApiBaseUrl,
  releaseAuthFleetTransaction,
  updateSetSettlementBatch,
} from './transaction.service';
import {
  IEmailTransactionByHolistic,
  IEmailTransactionInput,
  IMerchant,
  ITransactionsRequestId,
} from './transaction.type';

const TRANSACTIONS = 'transactions';
const TRANSACTION_DETAILS = 'transaction_details';
const RELATED_TRANSACTIONS = 'related_transactions';
const MERCHANTS = 'merchants';
const LOYALTY_CATEGORIES = 'loyalty_categories';
const APPROVAL_REQUEST_DETAILS = 'approval_request_details';
const FLEET_TRANSACTION_DETAILS = 'fleet_transaction_details';
const RELATED_FLEET_TRANSACTIONS = 'related_fleet_transactions';
const RELOAD_FLEET_TRANSACTIONS = 'reload_fleet_transaction';

export const useReleaseAuthTransaction = (transactionUid: string) => {
  const queryClient = useQueryClient();
  return useMutation(() => releaseAuthTransaction(transactionUid), {
    onSuccess: () => {
      if (transactionUid) {
        queryClient.invalidateQueries([TRANSACTION_DETAILS]);
      }
    },
  });
};

export const useGetMerChants = (filter: Parameters<typeof getMerChants>[0]) => {
  return useQuery(
    [MERCHANTS, filter],
    () =>
      filter.searchValue ? getMerChants(filter) : (Promise.resolve([]) as Promise<IMerchant[]>),
    {
      keepPreviousData: true,
    },
  );
};

export const useGetTransactions = (filter: Parameters<typeof getTransactions>[0]) => {
  return useQuery([TRANSACTIONS, filter], () => getTransactions(filter), {
    keepPreviousData: true,
  });
};

export const useGetRelatedTransactions = (filter: Parameters<typeof getRelatedTransactions>[0]) => {
  return useQuery([RELATED_TRANSACTIONS, filter], () => getRelatedTransactions(filter), {
    keepPreviousData: true,
  });
};

export const useGetTransactionWithRequestID = (req: ITransactionsRequestId) => {
  return useQuery([APPROVAL_REQUEST_DETAILS, req], () => getTransactionWithRequestID(req));
};

export const useGetTransactionDetails = (id: string) => {
  return useQuery([TRANSACTION_DETAILS, id], () => getTransactionDetails(id));
};

export const useDownloadTransactions = () => {
  return useMutation((filter: Parameters<typeof downloadTransaction>[0]) =>
    downloadTransaction(filter),
  );
};

export const useSendEmails = () => useMutation((data: IEmailTransactionInput) => sendEmail(data));

export const useSendEmailsByHolistic = () =>
  useMutation((data: IEmailTransactionByHolistic) => sendEmailByHolistic(data));

export const useGetLoyaltyCategories = () => {
  return useQuery([LOYALTY_CATEGORIES], getLoyaltyCategories, {keepPreviousData: true});
};

// for fleet card transaction
export const useGetFleetTransactionDetails = (id: string) => {
  return useQuery([FLEET_TRANSACTION_DETAILS, id], () => getFleetTransactionDetails(id));
};

export const useReleaseAuthFleetTransaction = (transactionUid: string) => {
  const queryClient = useQueryClient();
  return useMutation(() => releaseAuthFleetTransaction(transactionUid), {
    onSuccess: () => {
      if (transactionUid) {
        queryClient.invalidateQueries([TRANSACTION_DETAILS]);
      }
    },
  });
};

export const useGetRelatedFleetTransactions = (
  filter: Parameters<typeof getRelatedFleetTransactions>[0],
) => {
  return useQuery([RELATED_FLEET_TRANSACTIONS, filter], () => getRelatedFleetTransactions(filter), {
    keepPreviousData: true,
  });
};

export const useGetCardFleetDetails = (cardNumber?: string) => {
  return useQuery([RELATED_FLEET_TRANSACTIONS, cardNumber], () => getCardDetails(cardNumber), {
    enabled: Boolean(cardNumber),
  });
};

export const useGetReloadFleetTransaction = (transactionUid?: string) => {
  return useQuery(
    [RELOAD_FLEET_TRANSACTIONS, transactionUid],
    () => getReloadsFleetTransactionApiBaseUrl(transactionUid),
    {
      enabled: Boolean(transactionUid),
    },
  );
};

export const useSetSettlementBatch = () => {
  return useMutation((data: any) => updateSetSettlementBatch(data));
};
