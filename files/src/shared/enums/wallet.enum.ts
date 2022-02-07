export enum TransactionType {
  TOPUP = 'TOPUP',
  TOPUP_REFUND = 'TOPUP_REFUND',
  ADJUSTMENT = 'ADJUSTMENT',
}

export enum TransactionSubType {
  TOPUP_BANK_ACCOUNT = 'TOPUP_BANK_ACCOUNT',
  TOPUP_CREDIT_CARD = 'TOPUP_CREDIT_CARD',
  TOPUP_REFUND_BANK_ACCOUNT = 'TOPUP_REFUND_BANK_ACCOUNT',
  TOPUP_REFUND_CREDIT_CARD = 'TOPUP_REFUND_CREDIT_CARD',
  TOPUP_DIGITAL_WALLET = 'TOPUP_DIGITAL_WALLET',
  TOPUP_REFUND_DIGITAL_WALLET = 'TOPUP_REFUND_DIGITAL_WALLET',
}

export enum TransactionStatus {
  CREATED = 'CREATED',
  PROCESSING = 'PROCESSING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  REFUNDED = 'REFUNDED',
}

export enum CreditCardBrand {
  MASTERCARD = 'MASTERCARD',
  VISA = 'VISA',
}

export enum CreditCardPaymentType {
  L_DC = 'L_DC',
  L_CC = 'L_CC',
  I_DC = 'I_DC',
  I_CC = 'I_CC',
}

export enum Currency {
  MYR = 'MYR',
  USD = 'USD',
  AUD = 'AUD',
  CAD = 'CAD',
  EUR = 'EUR',
  GBP = 'GBP',
  HKD = 'HKD',
  SGD = 'SGD',
  THB = 'THB',
}

export const getTopUpTypeLabel = (subType: TransactionSubType) => {
  switch (subType) {
    case TransactionSubType.TOPUP_BANK_ACCOUNT:
      return 'Top-up with Bank';
    case TransactionSubType.TOPUP_CREDIT_CARD:
      return 'Top-up with Card';
    case TransactionSubType.TOPUP_DIGITAL_WALLET:
      return 'Top-up with Digital Wallet';
    case TransactionSubType.TOPUP_REFUND_DIGITAL_WALLET:
      return 'Top-up refund with Digital Wallet';
    case TransactionSubType.TOPUP_REFUND_BANK_ACCOUNT:
      return 'Top-up refund with Bank';
    case TransactionSubType.TOPUP_REFUND_CREDIT_CARD:
      return 'Top-up refund with Card';
    default:
      return undefined;
  }
};
