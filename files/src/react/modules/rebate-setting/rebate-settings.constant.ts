import {BadgeProps} from '@setel/portal-ui';

export const fieldRequiredMessageError = 'This field is required.';
export const createRebateSettingTitle = 'Create new rebate setting';
export const confirmationDescription =
  'You will not be able to edit other existing rebate settings of this account/company after creating this setting. If the previous rebate setting does not have an End date, it will be set to end one day before this rebate setting commences.';
export const RebateSettingNotificationMessages = {
  successTitle: 'Success!',
  createdRebateSetting: 'You have successfully created a rebate setting.',
};

export enum rebateSettingLevel {
  ACCOUNT = 'Account',
  COMPANY = 'Company',
}

export enum RebateSettingStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  FUTURE = 'Future',
}

export const levelOptions = [
  {label: 'Smartpay account', value: rebateSettingLevel.ACCOUNT},
  {label: 'Smartpay company', value: rebateSettingLevel.COMPANY},
];

export const RebateStatusOptions = [
  {
    label: RebateSettingStatus.FUTURE,
    value: RebateSettingStatus.FUTURE,
  },
  {
    label: RebateSettingStatus.ACTIVE,
    value: RebateSettingStatus.ACTIVE,
  },
  {
    label: RebateSettingStatus.INACTIVE,
    value: RebateSettingStatus.INACTIVE,
  },
];

export const mappingRebateStatusColor: Record<RebateSettingStatus, BadgeProps['color']> = {
  [RebateSettingStatus.ACTIVE]: 'success',
  [RebateSettingStatus.INACTIVE]: 'grey',
  [RebateSettingStatus.FUTURE]: 'blue',
};
