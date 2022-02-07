import {IRequest} from '../merchant-users/merchant-users.type';
import {BillingIntervalUnit, TrialPeriodUnit} from '../billing-plans/billing-plan.types';
import {InvoicesStatus} from '../billing-invoices/billing-invoices.types';
import {CreditNotesStatus} from '../billing-credit-notes/billing-credit-notes.types';

export interface IBillingSubscriptionsDetailsProps {
  billingSubscriptionId: string;
}

export enum SubscriptionStatus {
  PENDING = 'PENDING',
  FUTURE = 'FUTURE',
  IN_TRIAL = 'IN_TRIAL',
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
}

export enum SubscriptionPhysicals {
  NONE = 'NONE',
  CHARGEABLE = 'CHARGEABLE',
  WAIVABLE = 'WAIVABLE',
}

export const SubscriptionPhysicalText = {
  [SubscriptionPhysicals.NONE]: '-',
  [SubscriptionPhysicals.CHARGEABLE]: 'Chargeable',
  [SubscriptionPhysicals.WAIVABLE]: 'Waivable',
};

export interface ISubscriptionFilter {
  searchMerchantName?: string;
  status?: string;
}

export const SubscriptionStatusOptions = [
  {
    value: '',
    label: 'Any status',
  },
  {
    value: SubscriptionStatus.ACTIVE,
    label: 'Active',
  },
  {
    value: SubscriptionStatus.CANCELLED,
    label: 'Cancelled',
  },
  {
    value: SubscriptionStatus.FUTURE,
    label: 'Future',
  },
  {
    value: SubscriptionStatus.IN_TRIAL,
    label: 'In trial',
  },
  {
    value: SubscriptionStatus.PENDING,
    label: 'Pending',
  },
];

export enum BillingAtStatus {
  START = 'START',
  END = 'END',
}

export enum PaymentTermStatus {
  NONE = 'NONE',
  DUE_IMMEDIATELY = 'DUE_IMMEDIATELY',
  SOME_DAYS = 'SOME_DAYS',
}

export enum CancelStatus {
  IMMEDIATELY = 'IMMEDIATELY',
  END_OF_INTERVAL = 'END_OF_INTERVAL',
  SPECIFIC_DATE = 'SPECIFIC_DATE',
  END_OF_TRIAL = 'END_OF_TRIAL',
}

export enum CancelMidTermIssuingStatus {
  DO_NOT = 'DO_NOT',
  PRORATED_CREDIT = 'PRORATED_CREDIT',
  FULL_CREDIT = 'FULL_CREDIT',
}

export enum RefundableCancellationStatus {
  RETAIN_CREDIT = 'RETAIN_CREDIT',
  INITIATE_REFUND = 'INITIATE_REFUND',
}

export enum ExistingUnpaidCancellationStatus {
  RETAIN = 'RETAIN',
  ATTEMPT_COLLECTION = 'ATTEMPT_COLLECTION',
  WRITE_OFF = 'WRITE_OFF',
}

export enum UnbilledChargesCancellationStatus {
  INVOICE = 'INVOICE',
  DELETE = 'DELETE',
}

export enum ApplyChangeEditStatus {
  IMMEDIATELY = 'IMMEDIATELY',
  ON_NEXT_RENEWAL = 'ON_NEXT_RENEWAL',
  ON_SPECIFIC_DATE = 'ON_SPECIFIC_DATE',
}

export enum ActivityType {
  CREATED_INVOICE = 'CREATED_INVOICE',
  CHANGED_INVOICE_STATUS = 'CHANGED_INVOICE_STATUS',
  PAYMENT_MADE = 'PAYMENT_MADE',
  ISSUED_REFUNDABLE_CREDIT_NOTE = 'ISSUED_REFUNDABLE_CREDIT_NOTE',
  ISSUED_ADJUSTMENT_CREDIT_NOTE = 'ISSUED_ADJUSTMENT_CREDIT_NOTE',
  APPLIED_REFUNDABLE_CREDIT_NOTE = 'APPLIED_REFUNDABLE_CREDIT_NOTE',
  REMOVED_REFUNDABLE_CREDIT_NOTE = 'REMOVED_REFUNDABLE_CREDIT_NOTE',
  VOIDED_CREDIT_NOTE = 'VOIDED_CREDIT_NOTE',
}

export interface Activity {
  activityType: ActivityType;
  description: string;
  createdAt: Date;
  id: string;
}

export interface History {
  id: string;
  status: CreditNotesStatus | InvoicesStatus;
  amount: number;
  createAt: Date;
  merchantId: string;
  objectId: string;
}

export interface BillingSubscription {
  id: string;
  status: SubscriptionStatus;
  merchantId: string;
  billingPlanId: string;
  invoiceName?: string;
  billingPlanDescription?: string;
  billingAt: BillingAtStatus;
  billingDate: number;
  billingInterval: number;
  billingIntervalUnit: BillingIntervalUnit;
  trialPeriod?: number | string;
  trialPeriodUnit?: TrialPeriodUnit;
  trialStartDate?: Date;
  trialEndDate?: Date;
  currentIntervalStartDate?: Date;
  currentIntervalEndDate?: Date;
  nextRenewalAt?: Date;
  nextBillingAt?: Date;
  paymentTerm: PaymentTermStatus;
  paymentTermDays?: number | string;
  pricingModel: string;
  price?: string | number;
  quantity?: number | string;
  setupFee?: number | string;
  startAt: Date;
  endDate?: Date;
  attributes: {
    merchantName: string;
    billingPlanName: string;
  };
  addressLine1?: string;
  addressLine2?: string;
  postcode?: string;
  city?: string;
  state?: string;
  email?: string;
  cancelStatus?: CancelStatus;
  cancelSpecificDate?: Date;
  cancelMidTermIssuingStatus?: CancelMidTermIssuingStatus;
  isIncludeCancellationDate?: boolean;
  refundableCancellationStatus?: RefundableCancellationStatus;
  existingUnpaidCancellationStatus?: ExistingUnpaidCancellationStatus;
  createdAt: Date;
  updatedAt: Date;
  editQuantity?: number | string;
  editPrice?: string | number;
  applyChangeEditStatus?: ApplyChangeEditStatus;
  applyChangeDate?: Date;
  hasCustomBillingDate: boolean;
  contactPerson?: string;
  paymentDueNoticePeriod?: number;
  eStatementEmails?: string[]; // emails
  eStatement: boolean;
  physical: SubscriptionPhysicals;
  dunningCode?: number;
  createdBy?: string;
  updatedBy?: string;
  createdByInfo?: {
    id: string;
    email: string;
    fullName: string;
  };
  updatedByInfo: {
    id: string;
    email: string;
    fullName: string;
  };
  contactInfo: {
    contactPerson: string;
    email: string;
    mobilePhone: string;
  };
  addressInfo: {
    addressLine1: string;
    addressLine2?: string;
    addressLine3?: string;
    addressLine4?: string;
    addressLine5?: string;
    city?: string;
    postcode: string;
    state: string;
    country: string;
  };
  balanceStatus: {
    balanceStatus: string;
    fleetPlan: string;
    merchantId: string;
    merchantType: string;
  };
  merchantName?: string;
}

export interface IBillingSubscriptionsRequest extends IRequest {
  merchantId?: string;
  status?: string;
}

export const getSubscriptionStatusColor = (status: SubscriptionStatus) => {
  switch (status) {
    case SubscriptionStatus.ACTIVE:
      return 'success';
    case SubscriptionStatus.CANCELLED:
      return 'error';
    case SubscriptionStatus.FUTURE:
      return 'blue';
    case SubscriptionStatus.IN_TRIAL:
      return 'lemon';
    case SubscriptionStatus.PENDING:
      return 'lemon';
  }
};

export interface BillingSubscriptionCreateProp {
  merchantId: string;
  billingPlanId: string;
  contactPerson?: string;
  invoiceName?: string;
  billingPlanDescription?: string;
  billingAt: BillingAtStatus;
  hasCustomBillingDate?: boolean;
  billingDate: number;
  trialPeriod?: number | string;
  trialPeriodUnit?: TrialPeriodUnit;
  paymentTerm: PaymentTermStatus;
  paymentTermDays?: number | string;
  pricingModel?: string;
  price?: string | number;
  quantity?: number | string;
  setupFee?: number | string;
  startAt: Date;
  endDate?: Date;
  paymentDueNoticePeriod: number;
  eStatements: string[];
  physical: string;
}

export interface BillingSubscriptionSPAccountCreateProp {
  merchantId: string;
  billingPlanId: string;
  dunningCode: number;
  eStatement: boolean;
  physical: string;
  paymentTermDays: number;
}

export interface BillingSubscriptionSPAccountEditProp {
  billingPlanId: string;
  dunningCode: number;
  eStatement: boolean;
  physical: string;
  paymentTermDays: number;
}

export interface BillingSubscriptionUpdateProp {
  id: string;
  merchantId: string;
  billingPlanId: string;
  invoiceName?: string;
  billingPlanDescription?: string;
  billingAt: BillingAtStatus;
  billingDate: number;
  trialPeriod?: number | string;
  trialPeriodUnit?: TrialPeriodUnit;
  paymentTerm: PaymentTermStatus;
  paymentTermDays?: number | string;
  price?: string | number;
  quantity?: number | string;
  setupFee?: number | string;
  startAt: Date;
  endDate?: Date;
}

export interface BillingSubscriptionUpdateSubscriptionProp {
  id: string;
  editPrice?: string | number;
  editQuantity?: number | string;
  applyChangeEditStatus?: string;
  applyChangeDate?: Date;
}

export interface BillingSubscriptionCancelSubscriptionProp {
  id: string;
  cancelStatus?: CancelStatus;
  cancelSpecificDate?: Date;
  cancelMidTermIssuingStatus?: CancelMidTermIssuingStatus;
  isIncludeCancellationDate?: boolean;
  refundableCancellationStatus?: RefundableCancellationStatus;
  existingUnpaidCancellationStatus?: ExistingUnpaidCancellationStatus;
}

export interface IBillingHistory extends IRequest {
  subscriptionId: string;
}
