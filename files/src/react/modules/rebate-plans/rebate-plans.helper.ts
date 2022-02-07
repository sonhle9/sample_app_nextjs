import {ITierBase} from '../../services/api-rebates.type';

export const fillMinimumValueOfTiers = (tiers: ITierBase[]): ITierBase[] => {
  if (tiers.length === 1) return tiers;
  for (let i = 1; i < tiers.length; i++) {
    tiers[i].minimumValue = tiers[i - 1].maximumValue
      ? +tiers[i - 1].maximumValue + 0.001 + ''
      : '0.000';
  }
  return tiers;
};

export const buildServerError = (serverError?: any) => {
  const errors: any = {};
  if (serverError?.response?.status === 400) {
    errors[serverError?.response?.data.field || 'message'] = serverError?.response?.data.message;
  }
  return errors;
};
