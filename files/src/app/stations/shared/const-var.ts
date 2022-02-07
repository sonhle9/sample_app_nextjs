import {
  LoyaltyCardIssuersEnum,
  LoyaltyCardStatusesEnum,
  LoyaltyCardVendorStatusesEnum,
  LoyaltyIdentityTypesEnum,
} from 'src/shared/enums/loyalty.enum';

import {TransactionSubType as TransactionWalletSubType} from '../../../shared/enums/wallet.enum';

export enum VendorTypes {
  sapura = 'sapura',
  sentinel = 'sentinel',
  setel = 'setel',
}

export enum FuelType {
  PRIMAX95 = 'PRIMAX 95',
  PRIMAX97 = 'PRIMAX97',
  DIESEL = 'DIESEL',
  EURO5 = 'EURO5',
}

export enum StationStatus {
  inactive = 'inactive',
  active = 'active',
  maintenance = 'maintenance',
  comingsoon = 'coming-soon',
}

export enum StoreStatus {
  inactive = 'inactive',
  active = 'active',
  maintenance = 'maintenance',
  comingsoon = 'coming-soon',
}

export enum FuelInCarStatus {
  inactive = 'inactive',
  active = 'active',
  maintenance = 'maintenance',
  comingsoon = 'coming-soon',
}

export enum ConciergeStatus {
  inactive = 'inactive',
  active = 'active',
  maintenance = 'maintenance',
  comingsoon = 'coming-soon',
}

export enum SetelAcceptedFor {
  fuel = 'fuel',
  store = 'store',
  kiosk = 'kiosk',
  fuelInCar = 'fuel-in-car',
}

export enum TransactionStatus {
  success = 'success',
  pending = 'pending',
  error = 'error',
  failed = 'failed',
  cancelled = 'cancelled',
  reversed = 'reversed',
  incoming = 'incoming',
}

export enum TransactionType {
  topup = 'TOPUP',
  refund = 'REFUND',
  purchase = 'PURCHASE',
  authorize = 'AUTHORIZE',
  capture = 'CAPTURE',
  cancel = 'CANCEL',
  topup_refund = 'TOPUP_REFUND',
}

export enum TransactionSubType {
  topupBankAccount = 'TOPUP_BANK_ACCOUNT',
  topupCreditCard = 'TOPUP_CREDIT_CARD',
  topupRefundCreditCard = 'TOPUP_REFUND_CREDIT_CARD',
  topupRefundBankAccount = 'TOPUP_REFUND_BANK_ACCOUNT',
  topupExternal = 'TOPUP_EXTERNAL',
  refundExternal = 'REFUND_EXTERNAL',
  redeemLoyaltyPoints = 'REDEEM_LOYALTY_POINTS',
  rewards = 'REWARDS',
  autoTopup = 'AUTO_TOPUP',
}

export enum PetrolBrandsEnum {
  petronas = 'petronas',
  shell = 'shell',
  petron = 'petron',
  bhp = 'bhp',
  caltex = 'caltex',
  buraqOil = 'buraqOil',
  no = '',
}

export enum CheckoutTransactionStatus {
  pending = 'pending',
  authorised = 'authorised',
  cancelled = 'cancelled',
  failed = 'failed',
  succeeded = 'succeeded',
  refunded = 'refunded',
  requires_payment_method = 'requires_payment_method',
  // requiresAction = 'requires_action',
  processing = 'processing',
  partially_refunded = 'partially_refunded',
  expired = 'expired',
}

export const DEFAULT_DROPDOWN_VALUES = [
  {
    text: 'All',
    value: '' as any,
  },
];

export const DEFAULT_DROPDOWN_ACTIONS = [
  {
    text: 'Select Action',
    value: '' as any,
  },
];

export const DATE_FORMAT = 'YYYY-MM-DD';
export const PREFUNDING_DAILY_SHAPSHOT_DATE_FORMAT = 'DD MMM YYYY - hh:mmA';
export const TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
export const DEFAULT_DATE_FORMAT = 'DD MMM Y - hh:mmA';

export const TRANSACTION_MIX_TYPE = {
  topupCard: {
    text: 'Top-up with Card',
    type: TransactionType.topup,
    subType: TransactionSubType.topupCreditCard,
  },
  topupBank: {
    text: 'Top-up with Bank',
    type: TransactionType.topup,
    subType: TransactionSubType.topupBankAccount,
  },
  topupDigitalWallet: {
    text: 'Top-up with Digital Wallet',
    type: TransactionType.topup,
    subType: TransactionWalletSubType.TOPUP_DIGITAL_WALLET,
  },
  authorize: {
    text: 'Authorise',
    type: TransactionType.authorize,
  },
  purchase: {
    text: 'Purchase',
    type: TransactionType.purchase,
  },
  capture: {
    text: 'Capture',
    type: TransactionType.capture,
  },
  cancel: {
    text: 'Cancel',
    type: TransactionType.cancel,
  },
  refund: {
    text: 'Refund',
    type: TransactionType.refund,
  },
  externalTopup: {
    text: 'External Top-up',
    type: TransactionType.topup,
    subType: TransactionSubType.topupExternal,
  },
  externalTopupRefund: {
    text: 'External Top-up Refund',
    type: TransactionType.refund,
    subType: TransactionSubType.refundExternal,
  },
  mesraPointRedemption: {
    text: 'Mesra Point Redemption',
    type: TransactionType.topup,
    subType: TransactionSubType.redeemLoyaltyPoints,
  },
  rewards: {
    text: 'Rewards',
    type: TransactionType.topup,
    subType: TransactionSubType.rewards,
  },
  topupRefundCard: {
    text: 'Top-up Refund with Card',
    type: TransactionType.topup_refund,
    subType: TransactionSubType.topupRefundCreditCard,
  },
  topupRefundBank: {
    text: 'Top-up Refund with Bank',
    type: TransactionType.topup_refund,
    subType: TransactionSubType.topupRefundBankAccount,
  },
  topupRefundDigitalWallet: {
    text: 'Top-up Refund with Digital Wallet',
    type: TransactionType.topup_refund,
    subType: TransactionWalletSubType.TOPUP_REFUND_DIGITAL_WALLET,
  },
  autoTopup: {
    text: 'Auto Top-up',
    type: TransactionType.topup,
    subType: TransactionSubType.autoTopup,
  },
};

export const TRANSACTION_SUB_TYPE = {
  [TransactionSubType.topupCreditCard]: TRANSACTION_MIX_TYPE.topupCard.text,
  [TransactionSubType.topupRefundCreditCard]: TRANSACTION_MIX_TYPE.topupRefundCard.text,
  [TransactionSubType.topupRefundBankAccount]: TRANSACTION_MIX_TYPE.topupRefundBank.text,
  [TransactionSubType.topupBankAccount]: TRANSACTION_MIX_TYPE.topupBank.text,
  [TransactionSubType.topupExternal]: TRANSACTION_MIX_TYPE.externalTopup.text,
  [TransactionSubType.refundExternal]: TRANSACTION_MIX_TYPE.externalTopupRefund.text,
  [TransactionSubType.redeemLoyaltyPoints]: TRANSACTION_MIX_TYPE.mesraPointRedemption.text,
  [TransactionSubType.rewards]: TRANSACTION_MIX_TYPE.rewards.text,
  [TransactionWalletSubType.TOPUP_DIGITAL_WALLET]: TRANSACTION_MIX_TYPE.topupDigitalWallet.text,
  [TransactionWalletSubType.TOPUP_REFUND_DIGITAL_WALLET]:
    TRANSACTION_MIX_TYPE.topupRefundDigitalWallet.text,
  [TransactionSubType.autoTopup]: TRANSACTION_MIX_TYPE.autoTopup.text,
};

export const CHECKOUT_TRANSACTIONS_MIX_STATUS = {
  requires_payment_method: {
    text: 'Requires Payment Method',
    type: CheckoutTransactionStatus.requires_payment_method,
  },
  // requires_action: {
  //   text: 'Requires Action',
  //   type: CheckoutTransactionStatus.requiresAction,
  // },
  processing: {
    text: 'Processing',
    type: CheckoutTransactionStatus.processing,
  },
  pending: {
    text: 'Pending',
    type: CheckoutTransactionStatus.pending,
  },
  succeeded: {
    text: 'Succeeded',
    type: CheckoutTransactionStatus.succeeded,
  },
  failed: {
    text: 'Failed',
    type: CheckoutTransactionStatus.failed,
  },
  cancelled: {
    text: 'Cancelled',
    type: CheckoutTransactionStatus.cancelled,
  },
  authorised: {
    text: 'Authorised',
    type: CheckoutTransactionStatus.authorised,
  },
  partially_refunded: {
    text: 'Partially Refunded',
    type: CheckoutTransactionStatus.partially_refunded,
  },
  refunded: {
    text: 'Refunded',
    type: CheckoutTransactionStatus.refunded,
  },
  expired: {
    text: 'Expired',
    type: CheckoutTransactionStatus.expired,
  },
};

export const LOYALTY_CARD_ISSUE_BY = {
  [LoyaltyCardIssuersEnum.petronas]: 'PETRONAS',
  [LoyaltyCardIssuersEnum.setel]: 'Setel',
};

export const LOYALTY_CARDS_STATUSES = {
  [LoyaltyCardStatusesEnum.active]: 'Active',
  [LoyaltyCardStatusesEnum.frozen]: 'Frozen',
  [LoyaltyCardStatusesEnum.issued]: 'Issued',
  [LoyaltyCardStatusesEnum.temporarilyFrozen]: 'Temporary Frozen',
};

export const LOYALTY_CARDS_VENDOR_STATUSES = {
  [LoyaltyCardVendorStatusesEnum.active]: 'Active',
  [LoyaltyCardVendorStatusesEnum.blocked]: 'Blocked',
  [LoyaltyCardVendorStatusesEnum.closed]: 'Closed',
  [LoyaltyCardVendorStatusesEnum.clpblocked]: 'CLP Blocked',
  [LoyaltyCardVendorStatusesEnum.fraudblocked]: 'Fraud Blocked',
  [LoyaltyCardVendorStatusesEnum.issued]: 'Issued',
  [LoyaltyCardVendorStatusesEnum.suspended]: 'Suspend',
};

export const LOYALTY_CARDS_TYPES = {
  true: 'Physical',
  false: 'Virtual',
};

export const LOYALTY_IDENTITY_TYPES = [
  {
    text: 'IC Number',
    value: LoyaltyIdentityTypesEnum.IC_NUMBER,
  },
  {
    text: 'Old IC Number',
    value: LoyaltyIdentityTypesEnum.OLC_IC_NUMBER,
  },
  {
    text: 'Passport Number',
    value: LoyaltyIdentityTypesEnum.PASSPORT_NUMBER,
  },
];

export const ORDER_STATUS_FILTER = DEFAULT_DROPDOWN_VALUES.concat([
  {
    text: 'Petrol',
    value: SetelAcceptedFor.fuel,
  },
  {
    text: 'Store',
    value: SetelAcceptedFor.store,
  },
]);

export const FUEL_ORDER_TYPE_FILTER = DEFAULT_DROPDOWN_VALUES.concat([
  {
    text: 'Petrol',
    value: SetelAcceptedFor.fuel,
  },
  {
    text: 'Fuel In Car',
    value: SetelAcceptedFor.fuelInCar,
  },
]);

export const ORDER_DATES_FILTER = DEFAULT_DROPDOWN_VALUES.concat([
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

export const CHECKOUT_TRANSACTION_DATES_FILTER = DEFAULT_DROPDOWN_VALUES.concat([
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

export enum UTIL_TRANSACTIONS_SEARCH_TYPES {
  REFERENCE_ID = 1,
  MOBILE = 2,
}

export const UTIL_TRANSACTIONS_SEARCH_OPTIONS = [
  {
    text: 'Reference ID',
    value: UTIL_TRANSACTIONS_SEARCH_TYPES.REFERENCE_ID,
  },
  {
    text: 'Phone number',
    value: UTIL_TRANSACTIONS_SEARCH_TYPES.MOBILE,
  },
];

export const MAX_TABLE_PAGE_ROWS = 10;
