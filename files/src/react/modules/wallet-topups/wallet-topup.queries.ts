import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  getWalletTransactionDetails,
  GetWalletTransactionsResult,
  refundTopup,
} from 'src/react/services/api-wallets.service';
import {refundTopupWallet} from 'src/react/services/api-payments.service';
import {ITransaction} from 'src/shared/interfaces/wallet.interface';
import {TransactionSubType} from 'src/shared/enums/wallet.enum';

export const walletTopupQueryKey = {
  topupListing: 'walletTopupListing',
  topupDetails: 'walletTopupDetails',
};

export const useWalletTopupDetails = (id: string) => {
  const queryClient = useQueryClient();
  return useQuery(
    [walletTopupQueryKey.topupDetails, id],
    () => getWalletTransactionDetails(id, {includeRefundStatus: true}),
    {
      placeholderData: () =>
        queryClient
          .getQueryData<GetWalletTransactionsResult>(walletTopupQueryKey.topupListing, {
            exact: false,
          })
          ?.items.find((item) => item.transactionUid === id),
    },
  );
};

export const useRefundTopup = (transaction: ITransaction) => {
  const queryClient = useQueryClient();

  return useMutation(
    () => {
      if (!transaction) {
        return;
      }
      if (
        transaction.subType === TransactionSubType.TOPUP_BANK_ACCOUNT ||
        transaction.subType === TransactionSubType.TOPUP_CREDIT_CARD
      ) {
        return refundTopup(transaction.referenceId);
      }
      return refundTopupWallet(transaction.referenceId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([walletTopupQueryKey.topupListing]);
        if (transaction) {
          queryClient.invalidateQueries([
            walletTopupQueryKey.topupDetails,
            transaction.transactionUid,
          ]);
        }
      },
    },
  );
};
