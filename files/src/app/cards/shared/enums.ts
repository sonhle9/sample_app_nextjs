import {BadgeProps} from '@setel/portal-ui';

export enum EditMode {
  ADD = 'add',
  EDIT = 'edit',
}

export enum EStatus {
  PENDING = 'pending',
  ISSUED = 'issued',
  ACTIVE = 'active',
  FROZEN = 'frozen',
  CLOSED = 'closed',
  CREATED = 'created',
}

export enum EIndicatorCard {
  NEW = 'new',
  REPLACEMENT = 'replacement',
  RENEWAL = 'renewal',
}

export const AllowedFuelProductss = [
  {
    value: 'primax_ron95',
    text: 'PETRONAS Primax RON95',
  },
  {
    value: 'primax_ron97',
    text: 'PETRONAS Primax RON97',
  },
  {
    value: 'diesel',
    text: 'PETRONAS Diesel',
  },
  {
    value: 'diesel_euro5',
    text: 'PETRONAS Diesel Euro 5',
  },
];

export enum AllowedFuelProducts {
  primax_ron95 = 'primax_ron95',
  primax_ron97 = 'primax_ron97',
  diesel = 'diesel',
  diesel_euro5 = 'diesel_euro5',
}

export enum Statuses {
  PENDING = 'pending',
  ACTIVE = 'active',
  FROZEN = 'frozen',
  CLOSED = 'closed',
}

export enum Reason {
  Lost = 'lost card',
  Stolen = 'stolen card',
  Damaged = 'damaged card',
  Expired = 'expired card',
  Fraud = 'fraud card',
  Chip = 'chip card conversion',
  Customer = 'customer request',
  Others = 'others',
}

export const Types = {
  Fleet: 'fleet',
  Loyalty: 'loyalty',
  Gift: 'gift',
};

export const Levels = {
  ENTERPRISE: 'enterprise',
  MERCHANT: 'merchant',
};

export const FormFactor = {
  Virtual: 'virtual',
  Physical: 'physical',
};

export const PhysicalType = {
  Magstripe: 'magstripe',
  Chip: 'chip',
  Scratch: 'scratch',
};

export const Subtype = {
  Driver: 'driver',
  Vehicle: 'vehicle',
  Standalone: 'standalone',
  Fleet_manager: 'fleet_manager',
};

const DEFAULT_DROPDOWN_VALUES = [
  {
    text: 'All',
    value: '' as any,
  },
];

export const ORDER_DATES_FILTER_CARD = DEFAULT_DROPDOWN_VALUES.concat([
  {
    text: 'Yesterday',
    value: -1,
  },
  {
    text: 'Last 7 days',
    value: -6,
  },
  {
    text: 'Last 30 days',
    value: -29,
  },
  {
    text: 'Specific date range',
    value: 's',
  },
]);

export const ColorMap: Record<EStatus, BadgeProps['color']> = {
  [EStatus.ACTIVE]: 'success',
  [EStatus.PENDING]: 'warning',
  [EStatus.FROZEN]: 'error',
  [EStatus.CLOSED]: 'grey',
  [EStatus.ISSUED]: 'success',
  [EStatus.CREATED]: 'blue',
};
