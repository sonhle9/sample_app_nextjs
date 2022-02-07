import {useFileUploads} from '@setel/portal-ui';
import {AxiosError} from 'axios';
import {useMutation, useQuery, UseQueryOptions} from 'react-query';
import {IPaginationParam, IPaginationResult} from 'src/react/lib/ajax';
import {
  bulkGrantPreview,
  getExternalOrders,
  bulkGrantOperation,
} from 'src/react/services/api-external-orders.service';
import {
  BulkGrantOrderPreviewItem,
  IExternalOrder,
  IExternalOrdersError,
  IExternalOrdersFilter,
} from 'src/react/services/api-external-orders.type';
export {BulkGrantOrderPreviewItem} from 'src/react/services/api-external-orders.type';

export function useExternalOrders<Result = IPaginationResult<IExternalOrder>>(
  userId: string,
  pagination?: IPaginationParam,
  filter?: IExternalOrdersFilter,
  config?: UseQueryOptions<
    IPaginationResult<IExternalOrder>,
    AxiosError<IExternalOrdersError>,
    Result
  >,
) {
  return useQuery(
    ['externals', pagination, filter],
    () => getExternalOrders(userId, pagination, filter),
    config,
  );
}

export const useBulkGrantPreview = (options?: {
  onSuccess: (records: Array<BulkGrantOrderPreviewItem>) => void;
}) => useMutation(bulkGrantPreview, options);

export const useBulkGrant = (options: {onChange: (records: Array<unknown>) => void}) =>
  useFileUploads({
    uploadOperation: bulkGrantOperation,
    maxCount: 1,
    onChange: options.onChange,
    removeWhenComplete: true,
  });
