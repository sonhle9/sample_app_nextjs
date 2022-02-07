import {apiClient} from '../../lib/ajax';
import {environment} from '../../../environments/environment';
import {extractErrorWithConstraints} from '../../../react/lib/utils';
import {IPukalAccount, IPukalAccountCreateRequest} from './billing-pukal-payment.types';
import {IMerchant} from 'src/shared/interfaces/merchant.interface';

const pukalUrl = `${environment.billingPlansApiBaseUrl}/api/pukal`;
const merchantUrl = `${environment.billingPlansApiBaseUrl}/api/merchants`;

export const getPukalAccountDetails = (merchantId: string): Promise<IPukalAccount> => {
  return apiClient
    .get<IPukalAccount>(`${pukalUrl}/pukal-account/${merchantId}`, {})
    .then((res) => res.data)
    .catch((err: any) => {
      return Promise.reject({
        name: err.response.status,
        message: extractErrorWithConstraints(err),
      });
    });
};

export const createPukalAccount = (body: IPukalAccountCreateRequest) => {
  return apiClient.post<IPukalAccount>(`${pukalUrl}/pukal-account`, body).then((res) => res.data);
};

export const updatePukalAccount = (body: IPukalAccountCreateRequest) => {
  return apiClient
    .put<IPukalAccount>(`${pukalUrl}/pukal-account/${body.merchantId}`, body)
    .then((res) => res.data);
};

export const clearPukalAccount = (merchantId: string) => {
  return apiClient
    .put<IPukalAccount>(`${pukalUrl}/pukal-account/${merchantId}/clear`, {})
    .then((res) => res.data);
};

export const readMerchant = (merchantId: string) => {
  return apiClient
    .get<IMerchant>(`${merchantUrl}/admin/merchants/${merchantId}`, {})
    .then((res) => {
      return res.data;
    })
    .catch((err: any) =>
      Promise.reject({
        name: err.response.data.errorCode,
        message: extractErrorWithConstraints(err),
      }),
    );
};
