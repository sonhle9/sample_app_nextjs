interface IRequest {
  perPage?: number;
  page?: number;
}

export interface IBillingPlansRequest extends IRequest {
  ids?: string[];
  searchName?: string;
  pricingModel?: string;
}

export interface IBillingPlansMerchantRequest extends IRequest {
  billingPlanId: string;
}

export enum BillingIntervalUnit {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export const BillingIntervalUnitOptions = [
  {label: 'Day', value: BillingIntervalUnit.DAY},
  {label: 'Week', value: BillingIntervalUnit.WEEK},
  {label: 'Month', value: BillingIntervalUnit.MONTH},
  {label: 'Year', value: BillingIntervalUnit.YEAR},
];

export enum TrialPeriodUnit {
  DAY = 'day',
  MONTH = 'month',
}

export const TrialPeriodUnitOptions = [
  {label: 'Day', value: TrialPeriodUnit.DAY.toString()},
  {label: 'Month', value: TrialPeriodUnit.MONTH.toString()},
];

export enum BillingDate {
  CYCLE_7th = 7,
  CYCLE_15th = 15,
  CYCLE_20th = 20,
  CYCLE_25th = 25,
  END_OF_MONTH = 31,
}

export const BillingDateTextPair = {
  [BillingDate.CYCLE_7th]: '7th of the month',
  [BillingDate.CYCLE_15th]: '15th of the month',
  [BillingDate.CYCLE_20th]: '20th of the month',
  [BillingDate.CYCLE_25th]: '25th of the month',
  [BillingDate.END_OF_MONTH]: 'End of the month',
};

export const BillingDateOption = [
  {label: '7th of the month', value: BillingDate.CYCLE_7th},
  {label: '15th of the month', value: BillingDate.CYCLE_15th},
  {label: '20th of the month', value: BillingDate.CYCLE_20th},
  {label: '25th of the month', value: BillingDate.CYCLE_25th},
  {label: 'End of the month', value: BillingDate.END_OF_MONTH},
];

export enum PricingModel {
  FLAT_FEE = 'FLAT_FEE',
  PER_UNIT = 'PER_UNIT',
  METERED = 'METERED',
}

export const PricingModelOptions = [
  {label: 'Flat fee', value: PricingModel.FLAT_FEE},
  {label: 'Per unit', value: PricingModel.PER_UNIT},
  {label: 'Metered', value: PricingModel.METERED},
];

export interface BillingPlan {
  id: string;
  name: string;
  invoiceName?: string;
  description?: string;
  billingInterval: number;
  billingIntervalUnit: BillingIntervalUnit;
  trialPeriod?: number;
  trialPeriodUnit?: TrialPeriodUnit;
  pricingModel: PricingModel;
  price?: number;
  setupFee?: number;
  merchantCount?: number;
  updatedAt: string;
  billingDate: BillingDate;
}

export interface IBillingPlanDetailProps {
  id: string;
}

export interface IMerchant {
  name: string;
  merchantId: string;
}

export type BillingPlanMerchant = {
  id: string;
  name: string;
  merchantName: string;
  merchantId: string;
  settlementsSchedule: any;
};

export type SubscriptionMerchant = {
  id: string;
  merchantId: string;
  attributes: {
    billingPlanName: string;
    merchantName: string;
  };
};

export const getPricingModelName = (pricingModel: string) => {
  const map = {
    [PricingModel.FLAT_FEE]: 'Flat fee',
    [PricingModel.PER_UNIT]: 'Per unit',
    [PricingModel.METERED]: 'Metered',
  };

  return map[pricingModel] || '';
};
