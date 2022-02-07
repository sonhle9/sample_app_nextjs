import {environment} from 'src/environments/environment';
import {IAutoTopup} from 'src/shared/interfaces/creditCards.interface';
import {
  ICreateTransactionInput,
  IGrantWalletInput,
  ITransaction,
  IVendorTransaction,
} from 'src/shared/interfaces/transaction.interface';
import {PaginationParams} from '@setel/web-utils';
import {
  ajax,
  fetchPaginatedData,
  filterEmptyString,
  getData,
  IPaginationParam,
} from 'src/react/lib/ajax';
import {IOrder} from 'src/shared/interfaces/order.interface';
import {
  ILoyaltyCard,
  IUpdateLoyaltyCardInput,
  IVendorLoyaltyCard,
} from 'src/shared/interfaces/loyaltyCard.interface';
import {ICustomerAccountSettings} from '../modules/customers/customers.type';
import {PaymentTransaction} from './api-payments.type';
import _pickBy from 'lodash/pickBy';
import {ILoyaltyTransaction, IPaginationMetadata} from 'src/shared/interfaces/loyalty.interface';

const baseUrl = `${environment.apiBaseUrl}/api/ops`;

export interface DownloadTransactionFilter {
  type: string;
  subType: string;
  from: string;
  to: string;
  status: string;
}

export interface IndexLmsLoyaltyTransactionsFilter extends IPaginationParam {
  userId: string;
  type: '1';
}

export const indexOrderTransactions = (orderId: string) => {
  return getData<PaymentTransaction[]>(`${baseUrl}/orders/${orderId}/transactions`);
};

export const downloadTransactions = (params: DownloadTransactionFilter) => {
  return ajax.get<Blob>(`${baseUrl}/reports/transactions`, {
    params: filterEmptyString({
      ...params,
      utcOffset: 8,
    }),
    responseType: 'blob',
    headers: {
      accept: 'text/csv',
    },
  });
};

export interface IWalletInfo {
  limit?: number;
  id?: string;
  balance?: number;
  isCreated: boolean;
}
export const getUserWalletInfo = (userId: string) => {
  return ajax.get<IWalletInfo>(`${baseUrl}/users/${userId}/wallet`);
};

export const updateInternalUser = (userId: string, isInternalUser: boolean) => {
  return ajax.put(`${baseUrl}/users/${userId}`, {internal: isInternalUser});
};

export const getUserAccountSetting = (userId: string) => {
  return ajax.get<ICustomerAccountSettings>(`${baseUrl}/users/${userId}/account-settings`);
};

export const indexUserLoyaltyCards = (userId: string) =>
  ajax.get<ILoyaltyCard>(`${baseUrl}/users/${userId}/loyalty-cards`);

export const readAutoTopup = (userId: string) =>
  ajax.get<IAutoTopup>(`${baseUrl}/wallet/${userId}/auto-topup`);

export const indexCustomerVendorTransactions = (userId: string) =>
  ajax.get<IVendorTransaction[]>(`${baseUrl}/users/${userId}/transactions/vendor`);

export enum TransactionType {
  TOPUP = 'topup',
  FUEL = 'fuel',
  STORE = 'store',
  REFUND = 'refund',
}
export interface TransactionFilters extends PaginationParams {
  userId: string;
  types?: string[];
  from?: Date;
  to?: Date;
}

export const indexCustomerTransactions = (params: TransactionFilters) =>
  fetchPaginatedData<ITransaction>(`${baseUrl}/users/${params.userId}/transactions`, params);

export const createExternalTransaction = (params: ICreateTransactionInput) =>
  ajax.post(`${baseUrl}/transactions`, params);

export const grantWallet = (params: IGrantWalletInput) =>
  ajax.post(`${baseUrl}/wallet/grant`, params);

export interface BulkWalletGrantingHistory {
  fileId: string;
  fileName: string;
  successfullTransactionsCount: number;
  failureTransactionsCount: number;
  userId?: string;
}

export const listBulkWalletGrantingHistory = (params: IPaginationParam) =>
  ajax.get<Array<BulkWalletGrantingHistory>>(`${baseUrl}/wallet/bulk-wallet-granting/history`, {
    params,
  });

export const getFailedBulkWalletGrantingFile = (fileId: string) =>
  ajax.get<string>(`${baseUrl}/wallet/bulk-wallet-granting/${fileId}/failed`, {
    responseType: 'blob',
    headers: {
      accept: 'text/csv',
    },
  });

export interface BulkWalletGrantingRecord {
  userId: string;
  amount: number;
  message: string;
}

export const parseBulkWalletGrantingFile = (csvFile: File) => {
  const formData = new FormData();

  formData.set('csvFile', csvFile);

  return ajax.post<Array<BulkWalletGrantingRecord>>(
    `${baseUrl}/wallet/upload-csv-bulk-wallet-granting`,
    formData,
  );
};

export const getOrder = (orderId: string) => ajax.get<IOrder>(`${baseUrl}/orders/${orderId}`);
export const indexUserLoyaltyTransactions = (userId: string, pagination?: IPaginationParam) =>
  ajax.get<IPaginationMetadata<ILoyaltyTransaction[]>>(
    `${baseUrl}/users/${userId}/loyalty-transactions`,
    {params: pagination},
  );

export const indexLmsLoyaltyTransactions = ({
  userId,
  type,
  page,
  perPage,
}: IndexLmsLoyaltyTransactionsFilter) =>
  fetchPaginatedData(`${baseUrl}/transactionHistory`, {page, perPage}, {params: {userId, type}});

export const updateUserLoyaltyCard = (
  userId: string,
  cardNumber: string,
  body: IUpdateLoyaltyCardInput,
) => ajax.put<IVendorLoyaltyCard>(`${baseUrl}/users/${userId}/loyalty-cards/${cardNumber}`, body);

export const deleteUserLoyaltyCard = (userId: string, cardNumber: string) =>
  ajax.delete(`${baseUrl}/users/${userId}/loyalty-cards/${cardNumber}`);

export const addUserLoyaltyCard = (userId: string, cardNumber: string) =>
  ajax.post(`${baseUrl}/users/${userId}/loyalty-cards/${cardNumber}`);

export const retryGrantPetronasPoints = (orderId: string, amount: number) =>
  ajax.post(`${baseUrl}/orders/${orderId}/retry-grant-points`, {amount});
