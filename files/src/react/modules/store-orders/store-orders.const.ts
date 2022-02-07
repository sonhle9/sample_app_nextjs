import {ConciergeOrderStatus} from 'src/react/services/api-store-orders.type';

export const CONCIERGE_ORDER_STATUS_LABELS: Record<keyof typeof ConciergeOrderStatus, string> = {
  created: 'Created',
  acknowledged: 'Acknowledged',
  modified: 'Modified',
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
