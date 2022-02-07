import {IPaginationParam, ajax, filterEmptyString} from 'src/react/lib/ajax';
import {environment} from 'src/environments/environment';
import {CheckoutTransaction} from './api-checkout.type';

const baseUrl = `${environment.checkoutsApiBaseUrl}/api/checkout`;

export interface IndexCheckoutTransactionFilter {
  userId?: string;
  dateRange: [string, string];
  keyword?: string;
  paymentStatus: string;
}

export interface IndexCheckoutTransactionData {
  items: Array<CheckoutTransaction>;
  perPage: number;
  nextPage: number;
  totalPage: number;
}

export const indexCheckoutTransactions = (
  params: Partial<IndexCheckoutTransactionFilter & IPaginationParam>,
) => {
  const {dateRange, ...filter} = params;
  return ajax.get<IndexCheckoutTransactionData>(`${baseUrl}/admin/sessions`, {
    params: filterEmptyString({
      ...filter,
      from: dateRange?.[0],
      to: dateRange?.[1],
    }),
    select: ({data, headers}) => ({
      items: data || [],
      perPage: +headers['x-per-page'] || 0,
      nextPage: +headers['x-next-page'] || 0,
    }),
  });
};
