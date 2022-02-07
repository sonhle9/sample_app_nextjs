import {apiClient} from '../../lib/ajax';
import {TOTAL_COUNT_HEADER_NAME} from '../../services/service.type';
import {
  Activity,
  BillingSubscription,
  BillingSubscriptionCancelSubscriptionProp,
  BillingSubscriptionCreateProp,
  BillingSubscriptionSPAccountCreateProp,
  BillingSubscriptionSPAccountEditProp,
  BillingSubscriptionUpdateProp,
  BillingSubscriptionUpdateSubscriptionProp,
  History,
  IBillingHistory,
  IBillingSubscriptionsRequest,
} from './billing-subscriptions.types';
import {environment} from '../../../environments/environment';
import {IRequest} from '../merchant-users/merchant-users.type';
import {IBillingInvoice} from '../billing-invoices/billing-invoices.types';
import {billingInvoicesUrl} from '../billing-invoices/billing-invoices.services';
import {billingCreditNotesUrl} from '../billing-credit-notes/billing-credit-notes.services';
import {ICreditNote} from '../billing-credit-notes/billing-credit-notes.types';
import {extractErrorWithConstraints} from '../../../react/lib/utils';

const billingUrl = `${environment.billingPlansApiBaseUrl}/api/billings`;
const billingSubscriptionsUrl = `${environment.billingPlansApiBaseUrl}/api/billings/admin/subscriptions`;

export const getBillingSubscriptions = async (params: IBillingSubscriptionsRequest = {}) => {
  const {data: billingSubscriptions, headers} = await apiClient.get<BillingSubscription[]>(
    billingSubscriptionsUrl,
    {params},
  );

  return {
    billingSubscriptions,
    total: headers[TOTAL_COUNT_HEADER_NAME],
  };
};

export const createBillingSubscriptions = (body: BillingSubscriptionCreateProp) => {
  return apiClient
    .post<BillingSubscription>(`${billingSubscriptionsUrl}`, body)
    .then((res) => res.data);
};

export const getBillingSubscription = (
  billingSubscriptionId: string,
): Promise<BillingSubscription> =>
  apiClient
    .get<BillingSubscription>(`${billingSubscriptionsUrl}/${billingSubscriptionId}`)
    .then((res) => res.data);

export const updateBillingSubscriptionsGeneral = (body: BillingSubscriptionUpdateProp) => {
  return apiClient
    .put<BillingSubscription>(`${billingSubscriptionsUrl}/${body.id}/general`, body)
    .then((res) => res.data);
};

export const updateBillingSubscriptionsEdit = (body: BillingSubscriptionUpdateSubscriptionProp) => {
  return apiClient
    .put<BillingSubscription>(`${billingSubscriptionsUrl}/${body.id}/edit`, body)
    .then((res) => res.data);
};

export const cancelBillingSubscriptionsGeneral = (
  body: BillingSubscriptionCancelSubscriptionProp,
) => {
  return apiClient
    .put<BillingSubscription>(`${billingSubscriptionsUrl}/${body.id}/cancel`, body)
    .then((res) => res.data);
};

export const revertCancelBillingSubscription = (
  billingSubscriptionId: string,
): Promise<BillingSubscription> =>
  apiClient
    .delete<BillingSubscription>(
      `${billingSubscriptionsUrl}/${billingSubscriptionId}/revert-cancel`,
    )
    .then((res) => res.data);

export const revertEditBillingSubscription = (
  billingSubscriptionId: string,
): Promise<BillingSubscription> =>
  apiClient
    .delete<BillingSubscription>(`${billingSubscriptionsUrl}/${billingSubscriptionId}/revert-edit`)
    .then((res) => res.data);

export const getBillingActivityLogs = async (params: IRequest = {}, subscriptionId: string) => {
  const billingActivityLogUrl = `${billingSubscriptionsUrl}/${subscriptionId}/activity-logs`;
  const {data: activityLogs, headers} = await apiClient.get<Activity[]>(billingActivityLogUrl, {
    params,
  });

  return {
    activityLogs,
    total: headers[TOTAL_COUNT_HEADER_NAME],
  };
};

export const getBillingInvoiceHistories = async (params: IBillingHistory) => {
  const {data: billingInvoices, headers} = await apiClient.get<IBillingInvoice[]>(
    billingInvoicesUrl,
    {params},
  );

  const histories: History[] = billingInvoices.map((invoice: IBillingInvoice) => {
    return {
      id: invoice.invoiceID,
      status: invoice.status,
      createAt: invoice.invoiceDate,
      amount: invoice.totalAmount,
      merchantId: invoice.merchantId,
      objectId: invoice.id,
    };
  });

  return {
    histories,
    total: headers[TOTAL_COUNT_HEADER_NAME],
    isEmpty: headers[TOTAL_COUNT_HEADER_NAME] === '0',
  };
};

export const getBillingCreditNoteHistories = async (params: IBillingHistory) => {
  const {data: billingInvoices, headers} = await apiClient.get<ICreditNote[]>(
    billingCreditNotesUrl,
    {params},
  );

  const histories: History[] = billingInvoices.map((creditNote: ICreditNote) => {
    return {
      id: creditNote.creditNoteID,
      status: creditNote.status,
      createAt: creditNote.issuedDate,
      amount: creditNote.totalAmount,
      merchantId: creditNote.merchantId,
      objectId: creditNote.id,
    };
  });

  return {
    histories,
    total: headers[TOTAL_COUNT_HEADER_NAME],
    isEmpty: headers[TOTAL_COUNT_HEADER_NAME] === '0',
  };
};

export const getSubscriptionSPAccountDetails = (
  merchantId: string,
): Promise<BillingSubscription> => {
  return apiClient
    .get<BillingSubscription>(
      `${billingUrl}/admin/subscriptions/${merchantId}/smartpay-account`,
      {},
    )
    .then((res) => res.data)
    .catch((err: any) =>
      Promise.reject({
        name: err.response.data.errorCode,
        message: extractErrorWithConstraints(err),
      }),
    );
};

export const createBillingSubscriptionSPAccount = (
  body: BillingSubscriptionSPAccountCreateProp,
) => {
  return apiClient
    .post<BillingSubscription>(`${billingUrl}/admin/subscriptions/smartpay`, body)
    .then((res) => res.data);
};

export const editBillingSubscriptionSPAccount = (
  id: string,
  body: BillingSubscriptionSPAccountEditProp,
) => {
  return apiClient
    .put<BillingSubscription>(`${billingUrl}/admin/subscriptions/smartpay/${id}/edit`, body)
    .then((res) => res.data);
};
