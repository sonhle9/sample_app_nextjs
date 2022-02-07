import {environment} from 'src/environments/environment';
import {apiClient, fetchPaginatedData, getData, IPaginationParam} from 'src/react/lib/ajax';
import {formatParameters} from 'src/shared/helpers/common';

const BASE_URL = `${environment.accountsApiBaseUrl}/api/idp`;

export interface IDeviceBodyUpdate {
  adminUsername: string;
  isBlocked: boolean;
  remark: string;
}

interface IAccountDevice {
  deviceId: string;
  id: string;
  status: string;
  isBlocked: boolean;
  remark: string;
  useId: string;
  createdAt: string;
}

interface IAccountDeviceList {
  pagination: {total: string};
  data: IAccountDevice[];
}

interface IUser {
  createdAt: string;
  deviceCreatedAt: string;
  email: string;
  emailVerified: boolean;
  enabled: boolean;
  fullName: string;
  id: string;
  username: string;
}

interface IAccountDeviceDetails {
  device: IAccountDevice;
  users: IUser[];
}

export const getAccountDevices = (
  pagination: IPaginationParam & {
    from?: string;
    to?: string;
    deviceId: string;
    isBlocked: string;
  },
) => fetchPaginatedData<IAccountDeviceList>(`${BASE_URL}/devices`, formatParameters(pagination));

export const unLinkDevice = (deviceId: string, adminUsername: string) => {
  return apiClient.delete(
    `${BASE_URL}/accounts/devices/${deviceId}?adminUsername=${adminUsername}`,
  );
};

export const updateDevice = (deviceId: string, deviceRemark: IDeviceBodyUpdate) => {
  return apiClient.put(`${BASE_URL}/devices/${deviceId}`, deviceRemark);
};

export const getAccountDeviceDetails = (id: string) =>
  getData<IAccountDeviceDetails>(`${BASE_URL}/devices/${id}`);
