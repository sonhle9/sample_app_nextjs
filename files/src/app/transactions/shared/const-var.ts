export enum PaymentMethod {
  WALLET = 'wallet',
  SMARTPAY = 'smartpay',
  VOUCHERS = 'vouchers',
  CARD = 'card',
  MESRA_CARD = 'mesra_card',
  BOOST = 'wallet',
  TNG = 'wallet',
  ONLINEBANKING = 'online_banking',
}

export enum PaymentSubmethod {
  WALLET_SETEL = 'wallet_setel',
  CARD_VISA = 'card_visa',
  CARD_MASTERCARD = 'card_mastercard',
  MESRA_CARD = 'mesra_card',
  CARD_AMEX = 'card_amex',
  SMARTPAY = 'smartpay',
  VOUCHERS = 'vouchers',
  CASH = 'cash',
  BOOST = 'wallet_boost',
  TNG = 'wallet_tng',
  GRAB = 'wallet_grab',
}

export const PaymentMethodAll = 'all';

export const TRANSACTION_MIX_PAYMENT_METHODS = {
  all: {
    text: 'All',
    paymentMethod: PaymentMethodAll,
    paymentSubmethod: '',
  },
  wallet: {
    text: 'Digital Wallet - All',
    paymentMethod: PaymentMethod.WALLET,
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
  grab: {
    text: 'Digital Wallet - Grab',
    paymentMethod: PaymentMethod.WALLET,
    paymentSubmethod: PaymentSubmethod.GRAB,
  },
  card: {
    text: 'Card - All',
    paymentMethod: PaymentMethod.CARD,
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
  cardMersacard: {
    text: 'Card - Mersacard',
    paymentMethod: PaymentMethod.MESRA_CARD,
    paymentSubmethod: PaymentSubmethod.MESRA_CARD,
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
  onlineBanking: {
    text: 'Online Banking',
    paymentMethod: PaymentMethod.ONLINEBANKING,
    paymentSubmethod: '',
  },
};

export const PaymentMethods = [
  PaymentMethodAll,
  PaymentMethod.WALLET,
  PaymentMethod.SMARTPAY,
  PaymentMethod.VOUCHERS,
  PaymentMethod.CARD,
  PaymentMethod.BOOST,
] as const;

export const PaymentSubmethods = [
  PaymentSubmethod.WALLET_SETEL,
  PaymentSubmethod.SMARTPAY,
  PaymentSubmethod.VOUCHERS,
  PaymentSubmethod.CARD_VISA,
  PaymentSubmethod.CARD_MASTERCARD,
  PaymentSubmethod.CARD_AMEX,
  PaymentSubmethod.BOOST,
  PaymentSubmethod.GRAB,
];
