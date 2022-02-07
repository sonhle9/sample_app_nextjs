import {BadgeProps, titleCase} from '@setel/portal-ui';
import {
  FraudProfilesStatus,
  FraudProfilesRestrictionType,
} from 'src/react/services/api-blacklist.service';

export const statusOptions = Object.values(FraudProfilesStatus).map((value) => ({
  value,
  label: titleCase(value),
}));

export const restrictionTypeLabel: Record<FraudProfilesRestrictionType, string> = {
  [FraudProfilesRestrictionType.USER_CHARGE]: 'Wallet charge',
  [FraudProfilesRestrictionType.USER_TOPUP]: 'Wallet top-up',
  [FraudProfilesRestrictionType.USER_LOGIN]: 'Login',
};

export const GetBadgeStatusColor: Record<
  string,
  Extract<BadgeProps['color'], 'success' | 'lemon' | 'error'>
> = {
  [FraudProfilesStatus.CLEARED]: 'success',
  [FraudProfilesStatus.WATCHLISTED]: 'lemon',
  [FraudProfilesStatus.BLACKLISTED]: 'error',
};
