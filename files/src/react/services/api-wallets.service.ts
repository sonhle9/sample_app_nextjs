import {environment} from 'src/environments/environment';
import {
  ajax,
  fetchPaginatedData,
  filterEmptyString,
  IPaginationParam,
  IPaginationResult,
} from 'src/react/lib/ajax';
import {TransactionType} from 'src/shared/enums/wallet.enum';
import {
  CreateAdjustmentTransactionParams,
  ITransaction,
  ITransactionIndexParams,
} from 'src/shared/interfaces/wallet.interface';

const baseUrl = `${environment.walletsApiBaseUrl}/api/wallets`;

export interface GetWalletTransactionOptions extends IPaginationParam, ITransactionIndexParams {
  type?: TransactionType;
}

export interface GetWalletTransactionsResult extends IPaginationResult<ITransaction> {}

export const getWalletTransactions = (options: GetWalletTransactionOptions) =>
  fetchPaginatedData<ITransaction>(`${baseUrl}/transactions`, filterEmptyString(options));

export const getWalletTransactionDetails = (
  id: string,
  options?: {
    includeRefundStatus?: boolean;
  },
) =>
  ajax.get<ITransaction>(`${baseUrl}/transactions/${id}`, {
    params: options,
  });

export const findTransactionByReferenceId = (referenceId: string) =>
  ajax.get<Array<ITransaction>>(`${baseUrl}/transactions`, {
    params: {
      referenceId,
    },
  });

export const refundTopup = (referenceId: string) =>
  ajax.post<ITransaction>(`${baseUrl}/admin/topups/${referenceId}/refund`);

export const createAdjustmentTransaction = (data: CreateAdjustmentTransactionParams) =>
  ajax.post<ITransaction>(`${baseUrl}/transactions/adjustments`, data, {
    headers: {
      'x-handled-user-id': data.customerId,
    },
  });
