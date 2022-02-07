export enum ChargeStatus {
  CREATED = 'CREATED',
  AUTHORISED = 'AUTHORISED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED',
  SUCCEEDED = 'SUCCEEDED',
  SETTLED = 'SETTLED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  WALLET = 'wallet',
  SMARTPAY = 'smartpay',
  VOUCHERS = 'vouchers',
  CARD = 'card',
  BOOST = 'wallet',
  TNG = 'wallet',
  LOYALTY = 'loyalty',
}

export enum PaymentSubmethod {
  WALLET_SETEL = 'WALLET_SETEL',
  CARD_VISA = 'CARD_VISA',
  CARD_MASTERCARD = 'CARD_MASTERCARD',
  CARD_AMEX = 'CARD_AMEX',
  SMARTPAY = 'SMARTPAY',
  VOUCHERS = 'VOUCHERS',
  CASH = 'CASH',
  BOOST = 'WALLET_BOOST',
  TNG = 'WALLET_TNG',
  WALLET_LOYALTY = 'WALLET_LOYALTY',
}

export const PaymentMethodAll = '';

export const TRANSACTION_MIX_PAYMENT_METHODS = {
  all: {
    text: 'All',
    paymentMethod: PaymentMethodAll,
    paymentSubmethod: '',
  },
  walletSetel: {
    text: 'Digital Wallet - Setel',
    paymentMethod: PaymentMethod.WALLET,
    paymentSubmethod: PaymentSubmethod.WALLET_SETEL,
  },
  boost: {
    text: 'Digital Wallet - Boost',
    paymentMethod: PaymentMethod.BOOST,
    paymentSubmethod: PaymentSubmethod.BOOST,
  },
  tng: {
    text: 'Digital Wallet - TNG',
    paymentMethod: PaymentMethod.TNG,
    paymentSubmethod: PaymentSubmethod.TNG,
  },
  wallet: {
    text: 'Digital Wallet - All',
    paymentMethod: PaymentMethod.WALLET,
    paymentSubmethod: '',
  },

  cardVisa: {
    text: 'Card - Visa',
    paymentMethod: PaymentMethod.CARD,
    paymentSubmethod: PaymentSubmethod.CARD_VISA,
  },
  cardAmex: {
    text: 'Card - Amex',
    paymentMethod: PaymentMethod.CARD,
    paymentSubmethod: PaymentSubmethod.CARD_AMEX,
  },
  cardMastercard: {
    text: 'Card - Mastercard',
    paymentMethod: PaymentMethod.CARD,
    paymentSubmethod: PaymentSubmethod.CARD_MASTERCARD,
  },
  card: {
    text: 'Card - All',
    paymentMethod: PaymentMethod.CARD,
    paymentSubmethod: '',
  },
  smartpay: {
    text: 'Smartpay',
    paymentMethod: PaymentMethod.SMARTPAY,
    paymentSubmethod: PaymentSubmethod.SMARTPAY,
  },
  vouchers: {
    text: 'Vouchers',
    paymentMethod: PaymentMethod.VOUCHERS,
    paymentSubmethod: PaymentSubmethod.VOUCHERS,
  },
  loyalty: {
    text: 'Loyalty',
    paymentMethod: PaymentMethod.LOYALTY,
    paymentSubmethod: PaymentSubmethod.WALLET_LOYALTY,
  },
};
