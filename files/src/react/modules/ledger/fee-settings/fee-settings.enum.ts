export enum FeeSettingTransactionTypes {
  TOPUP = 'TOPUP',
  TOPUP_REFUND = 'TOPUP_REFUND',
  PASSTHROUGH_FUEL = 'PASSTHROUGH_FUEL',
  PASSTHROUGH_FUEL_REFUND = 'PASSTHROUGH_FUEL__REFUND',
  PASSTHROUGH_STORE = 'PASSTHROUGH_STORE',
  PASSTHROUGH_STORE_REFUND = 'PASSTHROUGH_STORE_REFUND',
  TOPUP_BOOST = 'TOPUP_BOOST',
  TOPUP_REFUND_BOOST = 'TOPUP_REFUND_BOOST',
  CHARGE_TNG = 'CHARGE_TNG',
  REFUND_TNG = 'REFUND_TNG',
  CHARGE_BOOST = 'CHARGE_BOOST',
  REFUND_BOOST = 'REFUND_BOOST',
}

export enum TransactionPGVendors {
  IPAY88 = 'IPAY88',
  BOOST = 'BOOST',
  TNG = 'TNG',
  GRAB = 'GRAB',
}

export enum PaymentOptions {
  FPX = 'FPX',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  BOOST = 'BOOST',
  TNG = 'TNG',
}

export enum TierDurations {
  DAILY = 'DAILY',
}

export enum FeeTypes {
  PERCENTAGE = 'PERCENTAGE',
  FLAT = 'FLAT',
}

export enum TieringTypes {
  VOLUME = 'VOLUME',
}

export enum CardSchemes {
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
}
