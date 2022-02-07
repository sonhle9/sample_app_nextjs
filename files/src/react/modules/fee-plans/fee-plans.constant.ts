export const ceilingNumber = 99999.99;
export const ceilingPercentage = 100;

export enum FeePlanTypes {
  PRE_DEFINED = 'preDefined',
  CUSTOMIZED = 'customized',
}

export enum FeePlanPaymentMethodFamilies {
  // SETEL
  SETEL = 'setel',
  CREDIT_CARD = 'creditCard',
  DEBIT_CARD = 'debitCard',
  // PDB
  CLOSED_LOOP_CARD = 'closedLoopCard',
}

export enum FeePlanPaymentMethodTypes {
  // SETEL
  SETEL_WALLET = 'setelWallet',
  SETEL_CARDTERUS = 'setelCardTerus',
  SETEL_WALLETTERUS = 'setelWalletTerus',
  CARD_PRESENT = 'cardPresent',
  CARD_NOT_PRESENT = 'cardNotPresent',
  // PDB
  FLEET_CARD = 'fleetCard',
  GIFT_CARD = 'giftCard',
  LOYALTY_CARD = 'loyaltyCard',
}

export enum FeePlanPaymentMethodBrands {
  // SETEL
  SETEL = 'setel',
  VISA = 'visa',
  MASTERCARD = 'mastercard',
  AMERICAN_EXPRESS = 'americanExpress',
  BOOST = 'boost',
  // PDB
  PETRONAS_SMARTPAY = 'petronasSmartpay',
  PETRONAS_GIFT = 'petronasGift',
  PETRONAS_MESRA = 'petronasMesra',
}

export enum FeePlansPaymentMethodRateTypes {
  PERCENTAGE = 'percentage',
  FLAT_RATE = 'flatRate',
  NONE = 'none',
}

export const FeePlanPaymentMethodFamilyLabels = {
  setel: ['Setel'],
  pdb: ['Closed Loop Card'],
};

export const mappingPaymentMethodFamilies = {
  // SETEL
  setel: 'Setel',
  creditCard: 'Credit card',
  debitCard: 'Debit card',
  // PDB
  closedLoopCard: 'Closed Loop Card',
};

export const mappingPaymentMethodTypes = {
  // SETEL
  setelWallet: 'Setel Wallet',
  setelCardTerus: 'Setel CardTerus',
  setelWalletTerus: 'Setel WalletTerus',
  cardPresent: 'Card present',
  cardNotPresent: 'Card not present',
  // PDB
  fleetCard: 'Fleet card',
  giftCard: 'Gift card',
  loyaltyCard: 'Loyalty card',
};

export const mappingPaymentMethodBrands = {
  // SETEL
  setel: 'Setel',
  visa: 'Visa',
  mastercard: 'Mastercard',
  americanExpress: 'American Express',
  boost: 'Boost',
  // PDB
  petronasSmartpay: 'PETRONAS SmartPay',
  petronasGift: 'PETRONAS Gift',
  petronasMesra: 'PETRONAS Mesra',
};

export const mappingPaymentMethodLogos = {
  // SETEL
  setel: 'assets/images/payment-method-logo/setel.svg',
  visa: 'assets/images/payment-method-logo/visa.svg',
  mastercard: 'assets/images/payment-method-logo/mastercard.svg',
  americanExpress: 'assets/images/payment-method-logo/american-express.svg',
  boost: 'assets/images/payment-method-logo/boost.svg',
  // PDB
  petronasSmartpay: 'assets/images/payment-method-logo/petronas-smart-pay.svg',
  petronasGift: 'assets/images/payment-method-logo/petronas-gift.svg',
  petronasMesra: 'assets/images/payment-method-logo/petronas-mesra.svg',
};

export const RateTypeOptions = [
  {
    label: 'Percentage',
    value: FeePlansPaymentMethodRateTypes.PERCENTAGE.toString(),
  },
  {
    label: 'Flat rate',
    value: FeePlansPaymentMethodRateTypes.FLAT_RATE.toString(),
  },
  {label: 'None', value: FeePlansPaymentMethodRateTypes.NONE.toString()},
];

export const FeePlansNotificationMessages = {
  successTitle: 'Successfully',
  createdFeePlan: 'You have successfully created a new fee plan',
  updatedFeePlanPaymentMethod: 'You have successfully updated your fee plan',
  assignedFeePlan: 'You have successfully assigned your fee plan',
};

export const GLOBAL_FEE_PLAN_ID = 'global';

export const PAYMENT_METHOD_DETAILS = {
  // SETEL
  SETEL_SETELWALLET_SETEL: {
    family: FeePlanPaymentMethodFamilies.SETEL,
    type: FeePlanPaymentMethodTypes.SETEL_WALLET,
    brand: FeePlanPaymentMethodBrands.SETEL,
  },
  SETEL_SETELCARDTERUS_VISA: {
    family: FeePlanPaymentMethodFamilies.SETEL,
    type: FeePlanPaymentMethodTypes.SETEL_CARDTERUS,
    brand: FeePlanPaymentMethodBrands.VISA,
  },
  SETEL_SETELCARDTERUS_MASTERCARD: {
    family: FeePlanPaymentMethodFamilies.SETEL,
    type: FeePlanPaymentMethodTypes.SETEL_CARDTERUS,
    brand: FeePlanPaymentMethodBrands.MASTERCARD,
  },
  SETEL_SETELWALLETCARDTERUS_BOOST: {
    family: FeePlanPaymentMethodFamilies.SETEL,
    type: FeePlanPaymentMethodTypes.SETEL_WALLETTERUS,
    brand: FeePlanPaymentMethodBrands.BOOST,
  },

  // PDB
  CLOSEDLOOPCARD_GIFTCARD_PETRONASSMARTPAY: {
    family: FeePlanPaymentMethodFamilies.CLOSED_LOOP_CARD,
    type: FeePlanPaymentMethodTypes.FLEET_CARD,
    brand: FeePlanPaymentMethodBrands.PETRONAS_SMARTPAY,
  },
  CLOSEDLOOPCARD_GIFTCARD_PETRONASGIFT: {
    family: FeePlanPaymentMethodFamilies.CLOSED_LOOP_CARD,
    type: FeePlanPaymentMethodTypes.GIFT_CARD,
    brand: FeePlanPaymentMethodBrands.PETRONAS_GIFT,
  },
  CLOSEDLOOPCARD_LOYALTYCARD_PETRONASMESRA: {
    family: FeePlanPaymentMethodFamilies.CLOSED_LOOP_CARD,
    type: FeePlanPaymentMethodTypes.LOYALTY_CARD,
    brand: FeePlanPaymentMethodBrands.PETRONAS_MESRA,
  },
};
