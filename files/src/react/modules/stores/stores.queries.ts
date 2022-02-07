import {AxiosError} from 'axios';
import {useMutation, useQuery, UseMutationOptions, UseQueryOptions} from 'react-query';
import {IPaginationParam, IPaginationResult} from 'src/react/lib/ajax';
import {
  downloadStoreHistory,
  getMerchant,
  getStation,
  getStore,
  getStoreHistory,
  getStoreHistoryUsers,
  getStores,
  postProduct,
  postStore,
  putProduct,
  putStore,
} from 'src/react/services/api-stores.service';
import {trimWhiteSpace} from './stores.helpers';
import {
  IProduct,
  IStoreError,
  IStore,
  IStoresFilter,
  IStation,
  IMerchant,
  IStoreHistory,
  IStoreHistoryFilter,
  IStoreHistoryUserFilter,
  IStoreHistoryUser,
} from './stores.types';

export function useCreateStoreProduct(
  config?: UseMutationOptions<
    IProduct,
    AxiosError<IStoreError>,
    {product: IProduct; imgFile: File},
    unknown
  >,
) {
  return useMutation(({product, imgFile}) => postProduct(product, imgFile), config);
}

export function useUpdateStoreProduct(
  config?: UseMutationOptions<
    IProduct,
    AxiosError<IStoreError>,
    {product: IProduct; imgFile: File},
    unknown
  >,
) {
  return useMutation(({product, imgFile}) => putProduct(product, imgFile), config);
}

export function useStores<Result = IPaginationResult<IStore>>(
  pagination?: IPaginationParam,
  filter?: IStoresFilter,
  config?: UseQueryOptions<IPaginationResult<IStore>, AxiosError<IStoreError>, Result>,
) {
  return useQuery(['stores', pagination, filter], () => getStores(pagination, filter), config);
}

export function useStore<Result = IStore>(
  storeId: string,
  config?: UseQueryOptions<IStore, AxiosError<IStoreError>, Result>,
) {
  return useQuery(['stores', storeId], () => getStore(storeId), config);
}

export function useUpdateStore(
  storeId: string,
  config?: UseMutationOptions<IStore, AxiosError<IStoreError>, Partial<IStore>>,
) {
  return useMutation((values) => putStore(storeId, trimWhiteSpace(values)), config);
}

export function useCreateStore(
  config?: UseMutationOptions<IStore, AxiosError<IStoreError>, Partial<IStore>>,
) {
  return useMutation((values) => postStore(trimWhiteSpace(values)), config);
}

export function useStation<Result = IStation>(
  stationId: string,
  config?: UseQueryOptions<IStation, AxiosError<IStoreError>, Result>,
) {
  return useQuery(
    ['station', stationId],
    () => (stationId ? getStation(stationId) : Promise.resolve(undefined)),
    config,
  );
}

export function useMerchant<Result = IMerchant>(
  merchantId: string,
  config?: UseQueryOptions<IMerchant, AxiosError<IStoreError>, Result>,
) {
  return useQuery(
    ['merchant', merchantId],
    () => {
      if (merchantId) {
        return getMerchant(merchantId);
      }
      return Promise.resolve(undefined);
    },
    config,
  );
}

export function useStoreHistory<Result = IPaginationResult<IStoreHistory>>(
  pagination?: IPaginationParam,
  filter?: IStoreHistoryFilter,
  config?: UseQueryOptions<IPaginationResult<IStoreHistory>, AxiosError<IStoreError>, Result>,
) {
  return useQuery(
    ['store-history', pagination, filter],
    () => getStoreHistory(pagination, filter),
    config,
  );
}

export function useStoreHistoryUsers<Result = IPaginationResult<IStoreHistoryUser>>(
  pagination?: IPaginationParam,
  filter?: IStoreHistoryUserFilter,
  config?: UseQueryOptions<IPaginationResult<IStoreHistoryUser>, AxiosError<IStoreError>, Result>,
) {
  return useQuery(
    ['store-history-users', pagination, filter],
    () => getStoreHistoryUsers(pagination, filter),
    config,
  );
}

export function useDownloadStoreHistory(
  config?: UseMutationOptions<string, AxiosError<IStoreError>, IStoreHistoryFilter, unknown>,
) {
  return useMutation((filter) => downloadStoreHistory(filter), config);
}
