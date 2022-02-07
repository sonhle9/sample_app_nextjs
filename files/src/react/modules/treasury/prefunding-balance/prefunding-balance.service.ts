import {SETEL_MERCHANT_ID} from 'src/app/merchants/shared/constants';
import {environment} from 'src/environments/environment';
import {apiClient, fetchPaginatedData, IPaginationParam} from 'src/react/lib/ajax';
import {
  IAdjustBufferInput,
  ICreateAdjustmentTransactionData,
  PlatformAccounts,
  PrefundingBalanceAlertType,
} from './shared/prefunding-balance.type';

const BASE_URL = `${environment.ledgerApiBaseUrl}/api/payments`;
const BASE_URL_LEDGER = `${environment.ledgerApiBaseUrl}/api/ledger`;
const BASE_URL_MERCHANT = `${environment.merchantsApiBaseUrl}/api/merchants/admin/merchants`;
interface MerchantBalances {
  merchantId: string;
  type: string;
  currency: string;
  balance: number;
}

export const getPrefundingBalancesAlert = (pagination: IPaginationParam) => {
  return fetchPaginatedData<any>(`${BASE_URL}/prefunding-balance-alert`, pagination);
};

export const getPrefundingBalancesSummary = (pagination: IPaginationParam) => {
  return fetchPaginatedData<any>(`${BASE_URL}/admin/prefund-balance-daily-snapshots`, pagination);
};

export const addPrefundingBalanceAlert = (prefundingBalanceAlert: PrefundingBalanceAlertType) => {
  return apiClient
    .post<any>(`${BASE_URL}/prefunding-balance-alert`, prefundingBalanceAlert)
    .then((res) => res.data);
};

export const readMerchantBalances = async (merchantId: string) => {
  const {data: merchantBalances} = await apiClient.get<MerchantBalances[]>(
    `${BASE_URL_MERCHANT}/${merchantId}/balances`,
  );
  return merchantBalances;
};

export const deletePrefundingBalanceAlert = (prefundingBalanceId) => {
  return apiClient
    .delete<any>(`${BASE_URL}/prefunding-balance-alert/${prefundingBalanceId}`)
    .then((res) => res.data);
};

export const addSetelFundsFromBuffer = async (
  bufferAvailable: ICreateAdjustmentTransactionData,
) => {
  const bufferData = {
    amount: bufferAvailable.amount,
    reason: bufferAvailable.attributes.comment,
  };
  return apiClient
    .post<ICreateAdjustmentTransactionData>(
      `${BASE_URL_LEDGER}/accounts/buffer/add-setel-funds`,
      bufferData,
    )
    .then((res) => res.data);
};

export const createTopUpPrepaid = async (dataTopUp: any) => {
  return apiClient
    .post<IAdjustBufferInput>(
      `${BASE_URL_MERCHANT}/${SETEL_MERCHANT_ID}/balances/topup-prepaid`,
      dataTopUp,
    )
    .then((res) => res.data);
};

export const getAggregatesBalances = async () => {
  const {data: listAccount} = await apiClient.get(`${BASE_URL_LEDGER}/accounts/aggregates`);

  let bufferAccount;
  listAccount.forEach((account) => {
    if (account.userId === PlatformAccounts.BUFFER) {
      bufferAccount = account;
    }
  });

  return bufferAccount;
};
