import {CampaignRestrictionType, ICampaign} from 'src/shared/interfaces/reward.interface';

export type CustomerType = 'all' | 'hidden' | 'existing' | 'new';

export const getCustomerType = (campaign: ICampaign): CustomerType => {
  const newCustomerRestrictions: CampaignRestrictionType[] = [
    'newMember',
    'memberReferral',
    'withoutPromoCode',
  ];
  if (
    campaign?.restriction?.some((r) => newCustomerRestrictions.includes(r)) ||
    campaign?.codes?.length ||
    campaign?.disqualifyVoucherBatches?.length
  ) {
    return 'new';
  }

  if (campaign?.restriction?.includes('hidden')) {
    return 'hidden';
  }

  if (
    campaign?.restriction?.includes('brazeCustomer') ||
    campaign?.includeList?.length ||
    campaign?.excludeList?.length
  ) {
    return 'existing';
  }

  return 'all';
};

export const customerTypeOptions: Array<{label: string; value: CustomerType}> = [
  {value: 'all', label: 'All customers'},
  {value: 'hidden', label: 'Hidden'},
  {value: 'existing', label: 'Existing customer'},
  {value: 'new', label: 'New customer'},
];
