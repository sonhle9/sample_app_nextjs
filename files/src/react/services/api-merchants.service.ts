import {environment} from 'src/environments/environment';
import {ajax, fetchPaginatedData, filterEmptyString, IPaginationParam} from 'src/react/lib/ajax';
import {formatParameters} from 'src/shared/helpers/common';
import {
  IMerchantTransactionIndexParams,
  IDevice,
  IDeviceIndexParams,
} from 'src/shared/interfaces/merchant.interface';
import {IIndexMerchantFilters, IMerchant, MerchantTransaction} from './api-merchants.type';

const API_MERCHANTS_BASE_URL = `${environment.merchantsApiBaseUrl}/api/merchants`;

export const indexMerchants = (filters: IIndexMerchantFilters) =>
  fetchPaginatedData<IMerchant>(
    `${API_MERCHANTS_BASE_URL}/admin/merchants`,
    {
      page: filters && filters.page,
      perPage: filters && filters.perPage,
    },
    {
      params: formatParameters(filters),
    },
  );

export const getMerchantDetails = (merchantId: string) =>
  ajax.get<IMerchant>(`${API_MERCHANTS_BASE_URL}/admin/merchants/${merchantId}`);

export const searchMerchantsWithNameOrID = async (filter: IIndexMerchantFilters) => {
  const [{items: namedMerchants}, merchantWithID] = await Promise.all([
    indexMerchants(filter),
    filter.name
      ? getMerchantDetails(filter.name).catch<IMerchant>(() => null)
      : Promise.resolve<IMerchant>(null),
  ]);

  const merchantRecordMap: Record<string, IMerchant> = {};
  [...(namedMerchants || []), merchantWithID]
    .filter((m) => !!m)
    .forEach((m) => (merchantRecordMap[m.merchantId] = m));

  return Object.values(merchantRecordMap);
};
export interface IndexMerchantTransactionData {
  items: Array<MerchantTransaction>;
  perPage: number;
  nextPage: number;
}

export interface IndexMerchantTransactionFilter
  extends IMerchantTransactionIndexParams,
    IPaginationParam {}

export const indexMerchantTransactions = (filter: IndexMerchantTransactionFilter) =>
  ajax.get<IndexMerchantTransactionData>(`${API_MERCHANTS_BASE_URL}/admin/transactions`, {
    params: filterEmptyString(filter),
    select: ({data, headers}) => ({
      items: data,
      perPage: +headers['x-per-page'] || 0,
      nextPage: +headers['x-next-page'] || 0,
    }),
  });

export const merchantTransactionDetails = (id: string) =>
  ajax.get<MerchantTransaction>(`${API_MERCHANTS_BASE_URL}/admin/transactions/${id}`);

export interface IndexMerchantDeviceFilter
  extends Omit<IDeviceIndexParams, 'deviceDateFrom' | 'deviceDateTo' | 'status'>,
    IPaginationParam {
  dateRange?: [string, string];
  status?: IDeviceIndexParams['status'] | string;
}

export interface MerchantDevice extends IDevice {
  lastActivated: string;
}

export interface IndexMerchantDeviceData {
  items: Array<MerchantDevice>;
  perPage: number;
  nextPage: number;
}

export const listMerchantDevices = ({
  dateRange: [deviceDateFrom, deviceDateTo] = ['', ''],
  ...filter
}: IndexMerchantDeviceFilter) =>
  ajax.get<IndexMerchantDeviceData>(`${API_MERCHANTS_BASE_URL}/admin/devices`, {
    params: filterEmptyString({...filter, deviceDateFrom, deviceDateTo}),
    select: ({data, headers}) => ({
      items: data,
      perPage: +headers['x-per-page'] || 0,
      nextPage: +headers['x-next-page'] || 0,
    }),
  });

export const getMerchantDevice = (id: string) =>
  ajax.get<MerchantDevice>(`${API_MERCHANTS_BASE_URL}/admin/devices/${id}`);

export interface CreateMerchantDeviceInput {
  merchantMerchantIds: string[];
  serialNo: string;
  modelDevice: string;
}

export const createMerchantDevice = (input: CreateMerchantDeviceInput) =>
  ajax.post<MerchantDevice>(`${API_MERCHANTS_BASE_URL}/admin/devices`, filterEmptyString(input));

export interface UpdateMerchantDeviceInput extends CreateMerchantDeviceInput {
  id: string;
  status: string;
}

export const updateMerchantDevice = ({id, ...input}: UpdateMerchantDeviceInput) =>
  ajax.put<MerchantDevice>(`${API_MERCHANTS_BASE_URL}/admin/devices/${id}`, input);
