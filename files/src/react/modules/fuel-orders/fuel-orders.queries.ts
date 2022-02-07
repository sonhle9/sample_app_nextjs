import {AxiosError} from 'axios';
import {useQuery, UseQueryOptions, useMutation, useQueryClient} from 'react-query';
import {IPaginationParam, IPaginationResult} from 'src/react/lib/ajax';
import {
  cancelPaymentAuthorize,
  createAdminTags,
  getAdminOrder,
  getAdminTags,
  getManualReleaseStatus,
  indexOrders,
  manualCharge,
  manualChargeByGeneratedInvoice,
  manualReleaseOrder,
} from 'src/react/services/api-orders.service';
import {
  IAdminOrder,
  IAdminTag,
  IManualCharge,
  IManualChargeByGeneratedInvoice,
  IOrder,
} from './fuel-orders.interface';
import {IOrdersError} from 'src/react/services/api-orders.type';
import {IFuelOrdersFilter} from './fuel-orders.type';
import {PAYMENT_TRANSACTIONS} from '../customers/customers.queries';
import {useNotification} from 'src/react/hooks/use-notification';

const ADMIN_FUEL_ORDER_QUERY_KEY = 'admin_fuel_order_query_key';
export const ADMIN_TAGS_QUERY_KEY = 'admin_tags_query_key';

export function useFuelOrders<Result = IPaginationResult<IOrder>>(
  pagination?: IPaginationParam,
  filter?: IFuelOrdersFilter,
  config?: UseQueryOptions<IPaginationResult<IOrder>, AxiosError<IOrdersError>, Result>,
) {
  return useQuery(
    ['fuel-orders', pagination, filter],
    () => indexOrders(pagination, filter),
    config,
  );
}

export function useAdminFuelOrder(orderId: string, options: UseQueryOptions<IAdminOrder> = {}) {
  return useQuery([ADMIN_FUEL_ORDER_QUERY_KEY, orderId], () => getAdminOrder(orderId), {
    ...options,
  });
}

export const useManualReleaseOrder = () => {
  const queryClient = useQueryClient();
  const setNotify = useNotification();

  return useMutation(manualReleaseOrder, {
    onError: () =>
      setNotify({
        variant: 'error',
        title: 'Error',
        description: 'Fail to release the order. Please try again.',
      }),
    onSuccess: () =>
      queryClient
        .invalidateQueries(PAYMENT_TRANSACTIONS)
        .then(() => queryClient.invalidateQueries(ADMIN_FUEL_ORDER_QUERY_KEY))
        .then(() =>
          setNotify({
            variant: 'success',
            title: 'Successful!',
            description: 'This order has been released and cancelled.',
          }),
        ),
  });
};

export const useGetManualReleaseStatus = () => useMutation(getManualReleaseStatus);

export const useCancelPaymentAuthorize = () => {
  const queryClient = useQueryClient();
  const setNotify = useNotification();

  return useMutation(cancelPaymentAuthorize, {
    onError: (err: AxiosError<{message: string}>) =>
      setNotify({
        variant: 'error',
        title: 'Error',
        description: err?.response?.data?.message || 'Fail to cancel pre-authorized amount.',
      }),
    onSuccess: () =>
      queryClient
        .invalidateQueries(PAYMENT_TRANSACTIONS)
        .then(() => queryClient.invalidateQueries(ADMIN_FUEL_ORDER_QUERY_KEY))
        .then(() =>
          setNotify({
            variant: 'success',
            title: 'Successful!',
            description: 'Successfully canceled pre-authorized amount.',
          }),
        ),
  });
};

export const useManualCharge = () => {
  const queryClient = useQueryClient();
  const setNotify = useNotification();

  return useMutation((payload: IManualCharge) => manualCharge(payload), {
    onError: (err: AxiosError<{message: string}>) =>
      setNotify({
        variant: 'error',
        title: 'Error',
        description: err?.response?.data?.message || 'Fail to manually charge.',
      }),
    onSuccess: () =>
      queryClient
        .invalidateQueries(PAYMENT_TRANSACTIONS)
        .then(() => queryClient.invalidateQueries(ADMIN_FUEL_ORDER_QUERY_KEY))
        .then(() =>
          setNotify({
            variant: 'success',
            title: 'Successful!',
            description: 'Successfully charged manually.',
          }),
        ),
  });
};

export const useManualChargeByGeneratedInvoice = () => {
  const queryClient = useQueryClient();
  const setNotify = useNotification();

  return useMutation(
    (payload: IManualChargeByGeneratedInvoice) => manualChargeByGeneratedInvoice(payload),
    {
      onError: (err: AxiosError<{message: string}>) =>
        setNotify({
          variant: 'error',
          title: 'Error',
          description:
            err?.response?.data?.message || 'Fail to manually charge by generated invoice.',
        }),
      onSuccess: () =>
        queryClient
          .invalidateQueries(PAYMENT_TRANSACTIONS)
          .then(() => queryClient.invalidateQueries(ADMIN_FUEL_ORDER_QUERY_KEY))
          .then(() =>
            setNotify({
              variant: 'success',
              title: 'Successful!',
              description: 'Successfully charged manually by generated invoice.',
            }),
          ),
    },
  );
};

export function useGetAdminTags<Result>(
  queryOptions: UseQueryOptions<IAdminTag[], unknown, Result> = {},
) {
  return useQuery(ADMIN_TAGS_QUERY_KEY, () => getAdminTags(), queryOptions);
}

export const useEditTags = () => {
  const queryClient = useQueryClient();
  const setNotify = useNotification();

  return useMutation(createAdminTags, {
    onSuccess: () =>
      queryClient.invalidateQueries(ADMIN_FUEL_ORDER_QUERY_KEY).then(() =>
        setNotify({
          variant: 'success',
          title: 'Successful!',
          description: 'Successfully edited tags.',
        }),
      ),
  });
};
