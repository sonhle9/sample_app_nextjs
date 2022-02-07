import {PaginationParams} from '@setel/portal-ui';
import {environment} from 'src/environments/environment';
import {IPaginatedResult} from 'src/shared/interfaces/core.interface';
import {IdentityTypesEnum} from 'src/shared/interfaces/customer.interface';
import {IDevice} from 'src/shared/interfaces/devices';
import {ajax, extractError} from '../lib/ajax';

const BASE_URL = `${environment.accountsApiBaseUrl}/api/idp`;

export interface IUserProfile {
  createdAt: Date;
  email: string;
  emailVerified: false;
  fullName: string;
  id: string;
  internal: boolean;
  phone: string;
  referrerCode?: string;
  registrationCompleted: boolean;
  tags: string[];
  updatedAt: Date;
  userId: string;
  identityNumber?: string;
  identityType?: IdentityTypesEnum;
  accountVerified: true;
  dateOfBirth?: Date;
  gender?: string;
  language?: string;
}
export interface IUpdateDeviceBody {
  isBlocked: boolean;
  remark?: string;
  adminUsername: string;
}

export const getUserProfile = (userId: string) => {
  return ajax
    .get<IUserProfile>(`${BASE_URL}/profiles/${userId}`)
    .catch((err) => ({statusCode: err?.response?.data?.statusCode, message: extractError(err)}));
};

export const getUserDevices = (userId: string, paginationParam?: PaginationParams) => {
  return ajax.get<IPaginatedResult<IDevice[]>>(`${BASE_URL}/accounts/${userId}/devices`, {
    params: paginationParam,
  });
};

export const updateDevice = (deviceId: string, updateDeviceBody: IUpdateDeviceBody) => {
  return ajax.put(`${BASE_URL}/devices/${deviceId}`, updateDeviceBody);
};

export const deleteDevice = (deviceId: string, adminUsername: string) => {
  return ajax.delete(`${BASE_URL}/accounts/devices/${deviceId}?adminUsername=${adminUsername}`);
};

export const updateTags = (userId: string, tags: string[]) => {
  const payload = {
    userId,
    tags,
  };
  return ajax.put<IUserProfile>(`${BASE_URL}/profiles/${userId}`, payload);
};

export const createTags = (userId: string, tags: string[]) => {
  const payload = {
    userId,
    tags,
  };
  return ajax.post<IUserProfile>(`${BASE_URL}/profiles/`, payload);
};

export const updatePhoneNumber = (userId: string, phone: string) => {
  return ajax.put<IUserProfile>(`${BASE_URL}/admin/accounts/${userId}/phone`, {userId, phone});
};
