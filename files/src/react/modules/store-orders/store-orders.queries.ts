import {AxiosError} from 'axios';
import {useMutation, useQuery, UseQueryOptions, UseMutationOptions} from 'react-query';
import {IPaginationParam, IPaginationResult} from 'src/react/lib/ajax';
import {
  downloadDeliver2MeStoreOrders,
  downloadOverCounterStoreOrders,
  getOverCounterOrders,
  getDeliver2MeOrder,
  getDeliver2MeOrders,
  getOverCounterOrder,
} from 'src/react/services/api-store-orders.service';
import {
  IOverCounterOrder,
  IDeliver2MeOrder,
  IStoreOrderError,
  IStoreOrderFilter,
} from 'src/react/services/api-store-orders.type';

export function useOverCounterOrders<Result = IPaginationResult<IOverCounterOrder>>(
  pagination?: IPaginationParam,
  filter?: IStoreOrderFilter,
  config?: UseQueryOptions<
    IPaginationResult<IOverCounterOrder>,
    AxiosError<IStoreOrderError>,
    Result
  >,
) {
  return useQuery(
    ['stores', 'over-counter', pagination, filter],
    () => getOverCounterOrders(pagination, filter),
    config,
  );
}

export function useDeliver2MeOrders<Result = IPaginationResult<IDeliver2MeOrder>>(
  pagination?: IPaginationParam,
  filter?: IStoreOrderFilter,
  config?: UseQueryOptions<
    IPaginationResult<IDeliver2MeOrder>,
    AxiosError<IStoreOrderError>,
    Result
  >,
) {
  return useQuery(
    ['stores', pagination, filter],
    () => getDeliver2MeOrders(pagination, filter),
    config,
  );
}

export function useDeliver2MeOrder(orderId: string) {
  return useQuery(['store-orders', 'deliver2me', orderId], () => getDeliver2MeOrder(orderId));
}

export function useOverCounterOrder(orderId: string) {
  return useQuery(['store-orders', 'over-counter', orderId], () => getOverCounterOrder(orderId));
}

export function useDownloadDeliver2MeStoreOrders(
  config?: UseMutationOptions<string, AxiosError<IStoreOrderError>, IStoreOrderFilter, unknown>,
) {
  return useMutation((filter) => downloadDeliver2MeStoreOrders(filter), config);
}

export function useDownloadOverCounterStoreOrders(
  config?: UseMutationOptions<string, AxiosError<IStoreOrderError>, IStoreOrderFilter, unknown>,
) {
  return useMutation((filter) => downloadOverCounterStoreOrders(filter), config);
}
