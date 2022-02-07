import {environment} from 'src/environments/environment';
import {
  ajax,
  fetchPaginatedData,
  filterEmptyString,
  getData,
  IPaginationParam,
} from 'src/react/lib/ajax';
import {IOrder} from 'src/shared/interfaces/order.interface';
import _pickBy from 'lodash/pickBy';
import {IFuelOrdersFilter} from '../modules/fuel-orders/fuel-orders.type';
import {
  IAdminOrder,
  IAdminTag,
  IGetManualReleaseStatus,
  IManualCharge,
  IManualChargeByGeneratedInvoice,
} from '../modules/fuel-orders/fuel-orders.interface';

const baseUrl = environment.orderApiBaseUrl + '/api/orders';

export function getOrder(orderId: string): Promise<IOrder> {
  return ajax.get(`${baseUrl}/orders/${orderId}`);
}

export function getAdminOrder(orderId: string): Promise<IAdminOrder> {
  return ajax.get(`${baseUrl}/orders/admin/orders/${orderId}`);
}

export function getAdminTags(tag?: string): Promise<IAdminTag[]> {
  const endpoint = [`${baseUrl}/admin/tags`, tag && `?tag=${tag}`].filter(Boolean).join('');
  return ajax.get(endpoint);
}

export function createAdminTags({
  orderId,
  tags,
}: {
  orderId: string;
  tags: string[];
}): Promise<IAdminTag[]> {
  return ajax.post(`${baseUrl}/admin/tags/${orderId}`, {adminTags: tags});
}

export function getManualReleaseStatus(orderId: string): Promise<IGetManualReleaseStatus> {
  return ajax.get(`${baseUrl}/admin/manual-release/orders/${orderId}`);
}

export function manualReleaseOrder(orderId: string): Promise<IAdminOrder> {
  return ajax.post(`${baseUrl}/admin/manual-release/orders/${orderId}`);
}

export function cancelPaymentAuthorize(orderId: string): Promise<IAdminOrder> {
  return ajax.post(`${baseUrl}/orders/admin/orders/${orderId}/payment/cancel`);
}

export function manualCharge({orderId, remark}: IManualCharge): Promise<boolean> {
  return ajax.post(`${baseUrl}/orders/admin/orders/${orderId}/payment/retry`, {message: remark});
}

export function manualChargeByGeneratedInvoice({
  orderId,
  ...body
}: IManualChargeByGeneratedInvoice): Promise<boolean> {
  return ajax.post(`${baseUrl}/orders/admin/orders/${orderId}/payment/invoice`, body);
}

export function indexOrders(pagination: IPaginationParam, filters: IFuelOrdersFilter) {
  return fetchPaginatedData<IOrder>(`${baseUrl}/orders/admin/orders`, pagination, {
    params: filterEmptyString(filters),
  });
}

export const getFuelOrdersCSV = (filters: IFuelOrdersFilter) =>
  getData<string>(`${baseUrl}/orders/admin/orders`, {
    headers: {
      accept: 'text/csv',
    },
    params: {
      ...filterEmptyString(filters),
    },
  });
