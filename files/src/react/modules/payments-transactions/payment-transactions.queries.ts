import * as React from 'react';
import {formatDate} from '@setel/portal-ui';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {downloadFile} from 'src/react/lib/utils';
import {downloadTransactions} from 'src/react/services/api-ops.service';
import {findTransactionByReferenceId} from 'src/react/services/api-wallets.service';
import {
  getTransaction,
  IndexPaymentsTransactionData,
  PaymentTransaction,
  cancelAuthorizedTransaction,
  voidWalletBalance,
  TransactionType,
  TransactionSubType,
  indexTransactions,
} from 'src/react/services/api-payments.service';

export const paymentTransactionsQueryKey = {
  indexTransactions: 'indexPaymentTransactions',
  indexUserTransactions: 'indexUserPaymentTransactions',
  transactionDetails: 'paymentTransactionDetails',
  transactionsByReferenceId: 'paymentTransactionsByReferenceId',
};

export const useTransactionDetails = (id: string) => {
  const queryClient = useQueryClient();
  return useQuery([paymentTransactionsQueryKey.transactionDetails, id], () => getTransaction(id), {
    placeholderData: () => {
      return queryClient
        .getQueryData<IndexPaymentsTransactionData>(
          [paymentTransactionsQueryKey.indexTransactions],
          {
            exact: false,
          },
        )
        ?.items.find((trx) => trx.id === id);
    },
  });
};

export const useDownloadTransactions = () =>
  useMutation(downloadTransactions, {
    onSuccess: (result) =>
      downloadFile(
        result,
        `transactions-${formatDate(new Date(), {format: 'yyyyMMddhhmmss'})}.csv`,
      ),
  });

export const useCancelAuthorizedTransaction = (trx: PaymentTransaction) => {
  const queryClient = useQueryClient();

  return useMutation(
    () =>
      cancelAuthorizedTransaction({
        authorizationId: trx.kipleTransactionId,
        amount: trx.amount,
        orderId: trx.orderId,
        merchantId:
          trx.merchantId || (trx.storecardTransaction && trx.storecardTransaction.merchantId),
        userId: trx.userId,
        posTransactionId: trx.posTransactionId,
        stationName: trx.stationName,
        remark: trx.remark,
        referenceType: trx.referenceType,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([paymentTransactionsQueryKey.transactionDetails, trx.id]);
        queryClient.invalidateQueries([paymentTransactionsQueryKey.indexTransactions]);
      },
    },
  );
};

export const useVoidWalletBalance = (trx: PaymentTransaction) => {
  const queryClient = useQueryClient();
  return useMutation(
    () =>
      voidWalletBalance({
        transactionId: trx.id,
        userId: trx.userId,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([paymentTransactionsQueryKey.transactionDetails, trx.id]);
        queryClient.invalidateQueries([paymentTransactionsQueryKey.indexTransactions]);
      },
    },
  );
};

export const useTransactionsByReferenceId = (trx: PaymentTransaction) => {
  const referenceId = React.useMemo(() => {
    if (!trx.referenceId) {
      return trx.id;
    }

    if (trx.type === TransactionType.topup) {
      if (trx.subtype === TransactionSubType.rewards) {
        return trx.referenceId;
      }
      return trx.id;
    }

    // if payment transaction has type topup refund, then walletTx referenceId should be referenceId + suffix(R)
    // this logic can be changed in the future
    if (trx.type === TransactionType.topup_refund) {
      const topupRefundRefIdSuffix = '(R)';
      return `${trx.referenceId}${topupRefundRefIdSuffix}`;
    }

    return trx.referenceId;
  }, [trx]);

  return useQuery([paymentTransactionsQueryKey.transactionsByReferenceId, referenceId], () =>
    findTransactionByReferenceId(referenceId),
  );
};

export const usePaymentTransactions = (...params: Parameters<typeof indexTransactions>) => {
  return useQuery([paymentTransactionsQueryKey.indexTransactions, 'index', params], () =>
    indexTransactions(...params),
  );
};
