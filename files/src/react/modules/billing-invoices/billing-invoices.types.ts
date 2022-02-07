import {IRequest} from '../merchant-users/merchant-users.type';

export interface IBillingSubscriptionsDetailsProps {
  billingSubscriptionId: string;
}

export enum InvoicesStatus {
  PAID = 'PAID',
  PAYMENT_DUE = 'PAYMENT_DUE',
  POSTED = 'POSTED',
  VOIDED = 'VOID',
}

export interface IInvoiceFilter {
  searchInvoice?: string;
  status?: string;
}

export const InvoicesStatusOptions = [
  {
    value: InvoicesStatus.PAID,
    label: 'Paid',
  },
  {
    value: InvoicesStatus.PAYMENT_DUE,
    label: 'Payment due',
  },
  {
    value: InvoicesStatus.POSTED,
    label: 'Posted',
  },
  {
    value: InvoicesStatus.VOIDED,
    label: 'Voided',
  },
];

export enum BillingAtStatus {
  START = 'START',
  END = 'END',
}

export interface IBillingInvoice {
  id: string;
  invoiceID: string;
  status: InvoicesStatus;
  merchantId: string;
  billingPlanId: string;
  subscriptionId: string;
  invoiceDate: Date;
  addressLine1: string;
  addressLine2: string;
  postcode: string;
  city: string;
  state: string;
  currentIntervalStartDate: Date;
  currentIntervalEndDate: Date;
  paymentTermDays: number;
  dueDate: Date;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  creditAmount: number;
  adjustedAmount: number;
  paidAt: Date;
  voidedAt: Date;
  creditNoteAppliedId: string;
  creditNoteIssuedId: string;
  creditNoteAdjustedId: string;
  enterpriseId: string;
  attributes: {
    merchantName: string;
    billingPlanName: string;
  };
}

export interface IBillingInvoicesRequest extends IRequest {
  merchantId?: string;
  status?: string;
}

export const getInvoiceStatusColor = (status: InvoicesStatus) => {
  switch (status) {
    case InvoicesStatus.PAID:
      return 'success';
    case InvoicesStatus.PAYMENT_DUE:
      return 'error';
    case InvoicesStatus.VOIDED:
      return 'grey';
    case InvoicesStatus.POSTED:
      return 'blue';
  }
};

export const convertAppliedArray2Objects = (appliedArr: any): IInvoiceFilter => {
  const rv = {};
  for (const element of appliedArr) {
    if (element !== undefined) rv[element.prop] = element.value;
  }
  return rv;
};
