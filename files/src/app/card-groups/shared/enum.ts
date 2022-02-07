const DEFAULT_DROPDOWN_VALUES = [
  {
    text: 'All',
    value: '' as any,
  },
];

export const ORDER_DATES_FILTER_CARDGROUP = DEFAULT_DROPDOWN_VALUES.concat([
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

export enum EditMode {
  ADD = 'add',
  EDIT = 'edit',
}

export enum Types {
  Fleet = 'fleet',
  Loyalty = 'loyalty',
  Gift = 'gift',
}

export enum FormFactor {
  Virtual = 'virtual',
  Physical = 'physical',
}

export enum Levels {
  ENTERPRISE = 'enterprise',
  MERCHANT = 'merchant',
}
