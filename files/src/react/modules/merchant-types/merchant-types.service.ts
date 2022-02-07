import {RegexEnum} from './merchant-types.constant';
import {
  IMerchantFieldResponse,
  IMerchantType,
  IMerchantTypeRequest,
  IMerchantTypeUsed,
} from './merchant-types.type';
import {apiClient, fetchPaginatedData} from '../../lib/ajax';
import {environment} from '../../../environments/environment';
import {formatDate} from '@setel/portal-ui';
import {extractErrorWithConstraints} from '../../lib/utils';

export const MERCHANT_TYPES_UPDATED_STORAGE_KEY = 'MERCHANT_TYPES_UPDATED_STORAGE_KEY';
export const MERCHANT_TYPES_USED_STORAGE_KEY = 'MERCHANT_TYPES_USED_STORAGE_KEY';

export const validateCode = (code: string): boolean => {
  const regex = new RegExp(RegexEnum.code);
  return regex.test(code);
};

export const getMerchantTypesUsed = () =>
  apiClient
    .get<IMerchantTypeUsed[]>(
      `${environment.merchantsApiBaseUrl}/api/merchants/admin/merchant-types/used`,
    )
    .then((res) => res.data)
    .catch((e) =>
      Promise.reject({
        message: extractErrorWithConstraints(e),
      }),
    );

export const getMerchantTypes = (params: IMerchantTypeRequest = {}) =>
  apiClient
    .get<IMerchantType[]>(`${environment.merchantsApiBaseUrl}/api/merchants/admin/merchant-types`, {
      params,
    })
    .then((res) => res.data)
    .catch((e) =>
      Promise.reject({
        message: extractErrorWithConstraints(e),
      }),
    );

export const getMerchantTypesPaginated = (options: IMerchantTypeRequest = {}) =>
  fetchPaginatedData<IMerchantType>(
    `${environment.merchantsApiBaseUrl}/api/merchants/admin/merchant-types/pagination`,
    options,
  );

export const createMerchantType = (merchantType: IMerchantType) => {
  return apiClient
    .post<IMerchantType>(`${environment.merchantsApiBaseUrl}/api/merchants/admin/merchant-types`, {
      ...merchantType,
      listingConfigurations: merchantType.listingConfigurations.map(
        (field) => field.value || field.name,
      ),
    })
    .then((res) => res.data)
    .catch((e) =>
      Promise.reject({
        message: extractErrorWithConstraints(e),
      }),
    );
};

export const updateMerchantType = (merchantType: IMerchantType) => {
  return apiClient
    .put<IMerchantType>(
      `${environment.merchantsApiBaseUrl}/api/merchants/admin/merchant-types/${
        merchantType.id || merchantType._id
      }`,
      {
        ...merchantType,
        listingConfigurations: merchantType.listingConfigurations.map(
          (field) => field.value || field.name,
        ),
      },
    )
    .then((res) => res.data)
    .catch((e) =>
      Promise.reject({
        message: extractErrorWithConstraints(e),
      }),
    );
};

export const deleteMerchantType = (merchantTypeId: string) => {
  return apiClient.delete(
    `${environment.merchantsApiBaseUrl}/api/merchants/admin/merchant-types/${merchantTypeId}`,
  );
};

export const getMerchantTypeDetails = (merchantTypeId: string) => {
  if (!merchantTypeId) {
    return null;
  }
  return apiClient
    .get<IMerchantType>(
      `${environment.merchantsApiBaseUrl}/api/merchants/admin/merchant-types/${merchantTypeId}`,
    )
    .then((res) => ({
      ...res.data,
      createdOn: formatDate(res.data.createdAt, {
        formatType: 'dateAndTime',
      }),
    }))
    .catch((e) =>
      Promise.reject({
        message: extractErrorWithConstraints(e),
      }),
    );
};

export const getMerchantFields = () => {
  return apiClient
    .get<IMerchantFieldResponse>(
      `${environment.merchantsApiBaseUrl}/api/merchants/admin/merchant-types/merchantFields`,
    )
    .then((res) => res.data)
    .catch((e) =>
      Promise.reject({
        message: extractErrorWithConstraints(e),
      }),
    );
};
