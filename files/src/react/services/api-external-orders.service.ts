import {environment} from 'src/environments/environment';
import {
  fetchPaginatedData,
  IPaginationParam,
  IPaginationResult,
  filterEmptyString,
  ajax,
  apiClient,
} from 'src/react/lib/ajax';
import {
  IExternalOrder,
  IExternalOrdersFilter,
  BulkGrantOrderPreviewItem,
} from './api-external-orders.type';
import {createUploadFileOperation} from '@setel/portal-ui';

const baseUrl = `${environment.externalOrdersApiBaseUrl}/api/external-orders`;

export function getExternalOrders(
  customerId: string,
  pagination?: IPaginationParam,
  filter?: IExternalOrdersFilter,
): Promise<IPaginationResult<IExternalOrder>> {
  return fetchPaginatedData<IExternalOrder>(
    `${baseUrl}/admin/customers/${customerId}/orders`,
    pagination,
    {
      params: filterEmptyString(filter),
    },
  );
}

export const bulkGrantPreview = (file: File) => {
  const formData = new FormData();
  formData.set('file', file);

  return ajax.post<Array<BulkGrantOrderPreviewItem>>(
    `${baseUrl}/admin/loyalty/bulk-grant/preview`,
    formData,
  );
};

export const bulkGrantOperation = createUploadFileOperation(
  (file) => {
    const formData = new FormData();
    formData.set('file', file);

    return {
      url: `${baseUrl}/admin/loyalty/bulk-grant`,
      data: formData,
      method: 'POST',
    };
  },
  {
    getErrorMessage: (err) => {
      return (ajax.isAxiosError(err) && err.response.data?.message) || 'Fail to upload';
    },
    axios: apiClient,
  },
);
