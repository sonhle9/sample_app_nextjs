import {apiClient} from '../../lib/ajax';
import {TOTAL_COUNT_HEADER_NAME} from '../../services/service.type';
import {IBillingInvoice, IBillingInvoicesRequest} from './billing-invoices.types';
import {environment} from '../../../environments/environment';

export const billingInvoicesUrl = `${environment.billingPlansApiBaseUrl}/api/billings/invoices`;

export const getBillingInvoices = async (params: IBillingInvoicesRequest = {}) => {
  const {data: billingInvoices, headers} = await apiClient.get<IBillingInvoice[]>(
    billingInvoicesUrl,
    {params},
  );

  return {
    billingInvoices,
    total: headers[TOTAL_COUNT_HEADER_NAME],
  };
};
