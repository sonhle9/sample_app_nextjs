const DEFAULT_DROPDOWN_VALUES = [
  {
    text: 'All',
    value: '' as any,
  },
];

export const ORDER_DATES_FILTER_CARD_TRANSACTIONS = DEFAULT_DROPDOWN_VALUES.concat([
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

export const TRANSACTION_TYPE_FILTER_CARD_TRANSACTIONS = DEFAULT_DROPDOWN_VALUES.concat([
  {
    text: 'Charge',
    value: 'charge',
  },
  {
    text: 'Top up',
    value: 'top_up',
  },
  {
    text: 'Issuance',
    value: 'issuance',
  },
  {
    text: 'Redemption',
    value: 'redemption',
  },
  {
    text: 'Preload',
    value: 'preload',
  },
  {
    text: 'Adjustment',
    value: 'adjustment',
  },
  {
    text: 'Payment',
    value: 'payment',
  },
  {
    text: 'Fee',
    value: 'fee',
  },
]);

export const TRANSACTION_STATUS_FILTER_CARD_TRANSACTIONS = DEFAULT_DROPDOWN_VALUES.concat([
  {
    text: 'Pending',
    value: 'pending',
  },
  {
    text: 'Authorised',
    value: 'authorised',
  },
  {
    text: 'Succeeded',
    value: 'succeeded',
  },
  {
    text: 'Failed',
    value: 'failed',
  },
  {
    text: 'Settled',
    value: 'settled',
  },
  {
    text: 'Posted',
    value: 'posted',
  },
  {
    text: 'Billed',
    value: 'billed',
  },
  {
    text: 'Paid',
    value: 'paid',
  },
]);

export const LEVELS = DEFAULT_DROPDOWN_VALUES.concat([
  {
    text: 'Card number',
    value: 'cardNumber',
  },
  {
    text: 'Merchant (Station)',
    value: 'merchant',
  },
  {
    text: 'Transaction Id',
    value: 'transaction',
  },
]);

export enum EStatusTransaction {
  PENDING = 'pending',
  AUTHORISED = 'authorised',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  SETTLED = 'settled',
  POSTED = 'posted',
  BILLED = 'billed',
  PAID = 'paid',
}

export enum ETransaction_Type {
  CHARGE = 'charge',
  TOP_UP = 'top_up',
  ISSUANCE = 'issuance',
  REDEMPTION = 'redemption',
  PRELOAD = 'preload',
  ADJUSTMENT = 'adjustment',
  PAYMENT = 'payment',
  FEE = 'fee',
}
