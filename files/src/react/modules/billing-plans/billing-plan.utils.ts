import {BillingIntervalUnit, PricingModel, TrialPeriodUnit} from './billing-plan.types';
import {formatMoney} from '@setel/portal-ui';

export const getIntervalString = (
  interval: number,
  unit: BillingIntervalUnit | TrialPeriodUnit,
) => {
  if (!interval || !unit) {
    return null;
  }
  if (interval > 1) {
    return `${interval} ${unit}s`;
  }
  return `${interval} ${unit}`;
};

export const getPricingModel = (pricingModel: PricingModel) => {
  const pricingModelValue = pricingModel.replace('_', ' ').toLowerCase();
  return pricingModelValue.charAt(0).toUpperCase() + pricingModelValue.slice(1);
};

export const getMoneyFormat = (money?: number) => {
  if (money === null || money === undefined) {
    return money;
  }

  return `RM${formatMoney(money)}`;
};
