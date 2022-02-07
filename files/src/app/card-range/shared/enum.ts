const DEFAULT_DROPDOWN_VALUES = [
  {
    text: 'All',
    value: '' as any,
  },
];

export const ORDER_TYPES_FILTER_CARDRANGE = DEFAULT_DROPDOWN_VALUES.concat([
  {
    text: 'Fleet',
    value: 'fleet',
  },
  {
    text: 'Loyalty',
    value: 'loyalty',
  },
  {
    text: 'Gift',
    value: 'gift',
  },
]);

export enum EditMode {
  ADD = 'add',
  EDIT = 'edit',
}
