import {PaymentMethod} from 'src/app/transactions/shared/const-var';
import {environment} from 'src/environments/environment';
import {ajax, filterEmptyString, IPaginationParam} from 'src/react/lib/ajax';
import {ICreditCard} from 'src/shared/interfaces/creditCards.interface';
import {ITransaction} from 'src/shared/interfaces/transaction.interface';
import {ICustomerRefreshBalanceResponse} from '../modules/customers/customers.type';
import {PaymentTransaction, TransactionSubType, TransactionType} from './api-payments.type';

export {
  PaymentTransaction,
  TransactionStatus,
  TransactionSubType,
  TransactionType,
} from './api-payments.type';

const baseUrl = `${environment.paymentsApiBaseUrl}/api/payments`;

export interface IndexPaymentsTransactionFilter {
  userId?: string;
  type: TransactionType | '';
  subtype: TransactionSubType | '';
  status: string;
  dateRange: [string, string];
  paymentMethod: PaymentMethod | '';
  paymentSubmethod?: string;
  orderId?: string;
}

export interface IndexPaymentsTransactionData {
  items: Array<PaymentTransaction>;
  perPage: number;
  nextPage: number;
}

export const indexTransactions = (
  params: Partial<IndexPaymentsTransactionFilter & IPaginationParam>,
) => {
  const {dateRange, ...filter} = params;
  return ajax.get<IndexPaymentsTransactionData>(`${baseUrl}/admin/transactions`, {
    params: filterEmptyString({
      ...filter,
      from: dateRange?.[0],
      to: dateRange?.[1],
    }),
    select: ({data, headers}) => ({
      items: data,
      perPage: +headers['x-per-page'] || 0,
      nextPage: +headers['x-next-page'] || 0,
    }),
  });
};

export const getTransaction = (id: string) =>
  ajax.get<PaymentTransaction>(`${baseUrl}/admin/transactions/${id}`);

export const refundTopupWallet = (id: string) => ajax.post(`${baseUrl}/wallets/topup/${id}/refund`);

export interface VoidWalletBalanceData {
  transactionId: string;
  userId: string;
}

export const voidWalletBalance = (data: VoidWalletBalanceData) =>
  ajax.post(`${baseUrl}/admin/grant-balance/void`, data);

export interface CancelTransactionData {
  authorizationId: string;
  amount: number;
  orderId: string;
  merchantId: string;
  userId?: string;
  posTransactionId?: string;
  stationName?: string;
  remark?: string;
  referenceType?: string;
  longitude?: string;
  latitude?: string;
}

export const cancelAuthorizedTransaction = (data: CancelTransactionData) =>
  ajax.post(`${baseUrl}/admin/cancel`, data);

export const getRefreshWalletBalanceByUserId = (userId: string) =>
  ajax.get<ICustomerRefreshBalanceResponse>(
    `${baseUrl}/admin/users/${userId}/wallet/refresh-balance`,
  );

export const getUserIncomingBalance = (userId: string) =>
  ajax.get<number>(`${baseUrl}/admin/users/${userId}/wallet/incoming-balance`);

export const indexUserCreditCards = (userId: string) =>
  ajax.get<ICreditCard[]>(`${baseUrl}/users/${userId}/credit-cards`);

export const getCustomerIncomingBalanceTransactions = (userId: string) =>
  ajax.get<ITransaction[]>(`${baseUrl}/admin/users/${userId}/wallet/incoming-balance/transactions`);

export const getUserCreditCard = (userId: string, cardId: string) =>
  ajax.get<ICreditCard>(`${baseUrl}/users/${userId}/credit-cards/${cardId}`);

export const deleteCreditCard = (creditCardId: string) =>
  ajax.delete<ICreditCard>(`${baseUrl}/admin/credit-cards/${creditCardId}`);

export interface BulkWalletGrantingRecord {
  userId: string;
  amount: number;
  message: string;
}

export interface BulkGrantWalletBalanceResponse {
  id: string;
  data: Array<BulkWalletGrantingRecord>;
}

export const bulkGrantWalletBalance = (data: {
  batchName: string;
  items: Array<BulkWalletGrantingRecord>;
}) => ajax.post<BulkGrantWalletBalanceResponse>(`${baseUrl}/admin/batch-grant-balance`, data);

export const getBulkGrantWalletBalanceProcessed = (batchId: string) =>
  ajax.get<{processed: number}>(`${baseUrl}/admin/batch-grant-balance-processed/${batchId}`);
