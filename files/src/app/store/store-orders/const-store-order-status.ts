export const CSTORE_ORDER_INIT = 'CSTORE_ORDER_INIT';

export const CSTORE_ORDER_CHARGE_SUCCESS = 'CSTORE_ORDER_CHARGE_SUCCESS';
export const CSTORE_ORDER_CHARGE_ERROR = 'CSTORE_ORDER_CHARGE_ERROR';

export const CSTORE_ORDER_INSUFFICIENT_BALANCE_ERROR = 'CSTORE_ORDER_INSUFFICIENT_BALANCE_ERROR';

export const CSTORE_ORDER_ISSUE_LOYALTY_POINTS_SUCCESS =
  'CSTORE_ORDER_ISSUE_LOYALTY_POINTS_SUCCESS';
export const CSTORE_ORDER_ISSUE_LOYALTY_POINTS_ERROR = 'CSTORE_ORDER_ISSUE_LOYALTY_POINTS_ERROR';

export const CSTORE_ORDER_VOID_SUCCESS = 'CSTORE_ORDER_VOID_SUCCESS';
export const CSTORE_ORDER_VOID_ERROR = 'CSTORE_ORDER_VOID_ERROR';

export const CSTORE_ORDER_CONFIRM_SUCCESS = 'CSTORE_ORDER_CONFIRM_SUCCESS';
export const CSTORE_ORDER_CANCEL_SUCCESS = 'CSTORE_ORDER_CANCEL_SUCCESS';

export enum StoreOrderStatus {
  created = 'Created',
  successfulCharge = 'Store Charge Success',
  errorCharge = 'Store Charge Error',
  successfulVoid = 'Void Success',
  errorVoid = 'Void Error',
  successfulPointIssuance = 'Loyalty Point Issuance Success',
  errorPointIssuance = 'Loyalty Point Issuance Error',
  confirmed = 'Confirmed',
  error = 'Error',
}

export const CONCIERGE_ORDER_STATUSES = {
  created: 'Created',
  acknowledged: 'Acknowledged',
  chargeSuccess: 'Charge Success',
  chargeError: 'Charge Error',
  delivered: 'Delivered',
  pointIssuanceSuccess: 'Point Issuance Success',
  pointIssuanceError: 'Point Issuance Error',
  pointVoidSuccess: 'Point Void Success',
  pointVoidError: 'Point Void Error',
  voidSuccess: 'Void Success',
  voidError: 'Void Error',
  CancelSuccess: 'Cancel Success',
  CancelError: 'Cancel Error',
};

export const STORE_ORDER_STATUSES = {
  [StoreOrderStatus.created]: [CSTORE_ORDER_INIT],
  [StoreOrderStatus.successfulCharge]: [CSTORE_ORDER_CHARGE_SUCCESS],
  [StoreOrderStatus.successfulPointIssuance]: [CSTORE_ORDER_ISSUE_LOYALTY_POINTS_SUCCESS],
  [StoreOrderStatus.successfulVoid]: [CSTORE_ORDER_VOID_SUCCESS],
  [StoreOrderStatus.confirmed]: [CSTORE_ORDER_CONFIRM_SUCCESS],
  [StoreOrderStatus.error]: [CSTORE_ORDER_INSUFFICIENT_BALANCE_ERROR],
  [StoreOrderStatus.errorPointIssuance]: [CSTORE_ORDER_ISSUE_LOYALTY_POINTS_ERROR],
  [StoreOrderStatus.errorCharge]: [CSTORE_ORDER_CHARGE_ERROR],
  [StoreOrderStatus.errorVoid]: [CSTORE_ORDER_VOID_ERROR],
};
