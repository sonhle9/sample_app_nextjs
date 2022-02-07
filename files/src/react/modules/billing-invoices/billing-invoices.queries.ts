import {useQuery} from 'react-query';
import {getBillingInvoices} from './billing-invoices.services';

const BillingInvoiceListingKey = 'BillingInvoiceList';

export const useBillingInvoices = (filter: Parameters<typeof getBillingInvoices>[0]) => {
  return useQuery([BillingInvoiceListingKey, filter], () => getBillingInvoices(filter), {
    keepPreviousData: true,
  });
};
