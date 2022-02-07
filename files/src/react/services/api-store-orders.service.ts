import {environment} from 'src/environments/environment';
import {
  apiClient,
  fetchPaginatedData,
  IPaginationParam,
  IPaginationResult,
} from 'src/react/lib/ajax';
import {IOverCounterOrder, IDeliver2MeOrder, IStoreOrderFilter} from './api-store-orders.type';
import pickBy from 'lodash/pickBy';

export function getOverCounterOrders(
  pagination?: IPaginationParam,
  filter?: IStoreOrderFilter,
): Promise<IPaginationResult<IOverCounterOrder>> {
  return fetchPaginatedData<IOverCounterOrder>(
    `${environment.storeApiBaseUrl}/api/store-orders/admin/store-orders`,
    pagination,
    {
      params: pickBy(filter, Boolean),
    },
  );
}

export function getDeliver2MeOrders(
  pagination?: IPaginationParam,
  filter?: IStoreOrderFilter,
): Promise<IPaginationResult<IDeliver2MeOrder>> {
  return fetchPaginatedData<IDeliver2MeOrder>(
    `${environment.storeApiBaseUrl}/api/store-orders/admin/in-car`,
    pagination,
    {
      params: pickBy(filter, Boolean),
    },
  );
}

export function getOverCounterOrder(orderId: string): Promise<IOverCounterOrder> {
  return apiClient
    .get(`${environment.storeApiBaseUrl}/api/store-orders/admin/store-orders/${orderId}`)
    .then((response) => response.data);
}

export function getDeliver2MeOrder(orderId: string): Promise<IDeliver2MeOrder> {
  return apiClient
    .get(`${environment.storeApiBaseUrl}/api/store-orders/admin/in-car/${orderId}`)
    .then((response) => response.data);
}

export function downloadDeliver2MeStoreOrders(filter?: IStoreOrderFilter): Promise<string> {
  return apiClient
    .get(`${environment.storeApiBaseUrl}/api/store-orders/admin/in-car/csv`, {
      params: pickBy(filter, Boolean),
      responseType: 'blob',
    })
    .then((response) => response.data);
}

export function downloadOverCounterStoreOrders(filter?: IStoreOrderFilter): Promise<string> {
  return apiClient
    .get(`${environment.storeApiBaseUrl}/api/store-orders/admin/store-orders/csv`, {
      params: pickBy(filter, Boolean),
      responseType: 'blob',
    })
    .then((response) => response.data);
}
