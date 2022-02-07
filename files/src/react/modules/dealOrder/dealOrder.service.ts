import {environment} from 'src/environments/environment';
import {apiClient} from 'src/react/lib/ajax';
import {formatParameters} from 'src/shared/helpers/common';
import {PaginationTokenParams, PaginationTokenResponse} from '../tokenPagination';
import {DealOrderStatus, DealOrderWithRelated} from './dealOrder.type';

export type ListDealOrdersParams = PaginationTokenParams & {
  merchantId?: string;
  name?: string;
  select?: 'profiles';
  search?: string;
  fromDate?: string;
  toDate?: string;
  status?: string | DealOrderStatus;
};

export const listDealOrders = (
  params: ListDealOrdersParams,
): Promise<
  PaginationTokenResponse<Omit<DealOrderWithRelated, 'merchant' | 'voucher' | 'outlet'>>
> =>
  apiClient
    .get(`${environment.dealsBaseUrl}/deal-orders`, {params: formatParameters(params)})
    .then(({data}) => data);

export const downloadOrdersReport = async (params: ListDealOrdersParams) => {
  const {data} = await apiClient.get(`${environment.dealsBaseUrl}/deal-orders/report`, {
    params: formatParameters(params),
    responseType: 'blob',
  });
  const link = document.createElement('a');

  link.href = window.URL.createObjectURL(data);
  link.setAttribute('download', 'deal-orders-report.csv');
  link.click();
};

export const sendReportViaEmails = async ({
  emails,
  params,
}: {
  emails: string[];
  params: ListDealOrdersParams;
}) => {
  await apiClient.post(
    `${environment.dealsBaseUrl}/deal-orders/report`,
    {
      emails,
    },
    {params: formatParameters(params)},
  );
};
