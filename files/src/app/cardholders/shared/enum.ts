const DEFAULT_DROPDOWN_VALUES = [
  {
    text: 'All',
    value: '' as any,
  },
];

export const ORDER_DATES_FILTER_CARDHOLDER = DEFAULT_DROPDOWN_VALUES.concat([
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
