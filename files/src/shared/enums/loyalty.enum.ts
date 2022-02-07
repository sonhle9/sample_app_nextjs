export enum LoyaltyCardStatusesEnum {
  issued = 'issued',
  active = 'active',
  frozen = 'frozen',
  temporarilyFrozen = 'temporarilyFrozen',
}

export enum LoyaltyCardTypesEnum {
  customer = 'customer',
  companySetel = 'company:Setel',
}

export enum LoyaltyCardIssuersEnum {
  setel = 'setel',
  petronas = 'petronas',
}

// snake_case values used here since the response from lms is mapped to this enum
// and snake_case values are present there
export enum LoyaltyCardVendorStatusesEnum {
  active = 'ACTIVE',
  issued = 'ISSUED',
  suspended = 'SUSPENDED',
  blocked = 'BLOCKED',
  fraudblocked = 'FRAUDBLOCKED',
  clpblocked = 'CLPBLOCKED',
  closed = 'CLOSED',
}

export enum LoyaltyCardFreezeReasonsEnum {
  underReview = 'underReview',
  suspectedFraud = 'suspectedFraud',
  customerContactVendor = 'customerContactVendor',
  cardClosed = 'cardClosed',
}

export enum LoyaltyTransactionTypesEnum {
  earn = 'earn',
  redeem = 'redeem',
  earnReversal = 'earnReversal',
  redeemReversal = 'redeemReversal',
}

export enum LoyaltyTransactionStatusesEnum {
  pending = 'pending',
  successful = 'successful',
  failed = 'failed',
}

export enum LoyaltyTransactionRedemptionDestinationTypesEnum {
  walletBalance = 'walletBalance',
}

export enum LoyaltyReferenceTypesEnum {
  order = 'order',
  store = 'store-order',
  reward = 'reward',
}

export enum LoyaltyIdentityTypesEnum {
  IC_NUMBER = 'ic_number',
  OLC_IC_NUMBER = 'old_ic_number',
  PASSPORT_NUMBER = 'passport_number',
}
