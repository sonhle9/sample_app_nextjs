import {BadgeProps} from '@setel/portal-ui';

export const statusColor: Record<string, BadgeProps['color']> = {
  active: 'success',
  inactive: 'grey',
};

export const statusLabel: Record<string, string> = {
  active: 'Active',
  inactive: 'Sunsetted',
};

export const statusOptions = Object.entries(statusLabel).map(([value, label]) => ({
  value,
  label,
}));

export const platformOptions = [
  {
    value: 'ios',
    label: 'iOS',
  },
  {
    value: 'android',
    label: 'Android',
  },
];
