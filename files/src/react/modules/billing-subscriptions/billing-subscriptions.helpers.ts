import {BillingIntervalUnit} from '../billing-plans/billing-plan.types';
import {DatesOfMonth, DaysOfWeek} from './billing-subscriptions.constants';
import {BillingSubscription, PaymentTermStatus} from './billing-subscriptions.types';

export const buildBillingAddress = (billingSubscription: BillingSubscription) => {
  let billingAddress = '';

  [
    billingSubscription?.addressLine1,
    billingSubscription?.addressLine2,
    billingSubscription?.postcode,
    billingSubscription?.city,
    billingSubscription?.state,
  ].forEach((item, index, array) => {
    if (!item) {
      return;
    }

    billingAddress += item;

    if (array.length - 1 > index) {
      billingAddress += ', ';
    }
  });

  return billingAddress;
};

export const buildPeriodTime = (numberOfPeriods: number | string, periodUnit: any) => {
  if (!numberOfPeriods || !periodUnit) {
    return;
  }

  return numberOfPeriods === 1
    ? `${numberOfPeriods} ${periodUnit}`
    : `${numberOfPeriods} ${periodUnit}s`;
};

export const buildPaymentDueNoticePeriodTime = (numberOfPeriods: number) => {
  if (!numberOfPeriods) {
    return;
  }
  return numberOfPeriods === 1
    ? `${numberOfPeriods} day earlier`
    : `${numberOfPeriods} days earlier`;
};

export const buildBillingDate = (
  billingDate: number,
  intervalUnit: BillingIntervalUnit,
  hasCustomBillingDate: boolean,
) => {
  if (!hasCustomBillingDate) return '';
  if (intervalUnit === BillingIntervalUnit.WEEK) {
    return DaysOfWeek[billingDate - 1];
  }

  if (intervalUnit === BillingIntervalUnit.MONTH || intervalUnit === BillingIntervalUnit.YEAR) {
    return DatesOfMonth[billingDate - 1];
  }

  return '';
};

export const buildPaymentTerm = (
  paymentTerm: PaymentTermStatus,
  paymentTermDay: number | string,
) => {
  if (paymentTerm === PaymentTermStatus.NONE) {
    return;
  }
  if (paymentTerm === PaymentTermStatus.DUE_IMMEDIATELY) {
    return 'Due immediately';
  }

  return `after ${paymentTermDay} ${paymentTermDay === 1 ? 'day' : 'days'}`;
};

export const buildCreditTerm = (
  paymentTerm: PaymentTermStatus,
  paymentTermDay: number | string,
) => {
  if (paymentTerm === PaymentTermStatus.NONE) {
    return;
  }
  if (paymentTerm === PaymentTermStatus.DUE_IMMEDIATELY) {
    return 'Due immediately';
  }

  return `${paymentTermDay} ${paymentTermDay === 1 ? 'day' : 'days'}`;
};

export const useMalaysiaTime = (time: Date) => {
  return new Date(time).toLocaleString('en-US', {timeZone: 'Asia/Kuala_Lumpur'});
};
