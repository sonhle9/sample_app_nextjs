import {BadgeColorType, TransactionStatus} from './api-collections.type';

export const TRANSACTION_STATUS_COLOR: {
  [key in TransactionStatus]?: BadgeColorType;
} = {
  CREATED: 'grey',
  AUTHORISED: 'lemon',
  CANCELLED: undefined,
  EXPIRED: 'grey',
  FAILED: 'error',
  SUCCEEDED: 'success',
  SETTLED: 'success',
  PARTIALLY_REFUNDED: 'success',
  REFUNDED: 'success',
  UNPOSTED: 'error',
};

export const TRANSACTION_STATUS_NAME: {
  [key in TransactionStatus]?: string;
} = {
  SUCCEEDED: 'SUCCEEDED',
  SETTLED: 'SETTLED',
  REFUNDED: 'REFUNDED',
  UNPOSTED: 'UNPOSTED',
};

export const CATEGORY_NAME: {
  [key in string]?: string;
} = {
  COLLECTION_GIFT_CARD_TOPUP: 'Gift card top up',
  COLLECTION_GIFT_CARD_TOPUP_CANCEL: 'Gift card top up',
  COLLECTION_FLEET_CARD_TOPUP: 'Fleet card top up',
  COLLECTION_FLEET_CARD_TOPUP_CANCEL: 'Fleet card top up',
};
