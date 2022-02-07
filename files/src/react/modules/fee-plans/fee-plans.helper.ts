import {FeePlansPaymentMethodRateTypes} from './fee-plans.constant';

export const buildFeePlanRate = (rateType: FeePlansPaymentMethodRateTypes, rate) =>
  rateType === FeePlansPaymentMethodRateTypes.PERCENTAGE ? `${rate}%` : `RM${rate}`;

export const removeCommasInBigNumber = (value: string) => value.split(',').join('');
