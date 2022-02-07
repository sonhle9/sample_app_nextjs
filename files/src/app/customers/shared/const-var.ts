export enum CheckoutPaymentMethod {
  SETEL = 'setel',
}

export enum CheckoutPaymentMethodBrand {
  SETEL = 'setel',
  VISA = 'visa',
  MASTER_CARD = 'mastercard',
}

export enum CheckoutPaymentMethodFamily {
  WALLET = 'wallet',
}

export const CheckouttMethodAll = 'all';

export const CHECKOUT_TRANSACTION_PAYMENT_METHODS = {
  all: {
    text: 'All',
    paymentMethodFamily: '',
    paymentMethodType: '',
    paymentMethodBrand: '',
  },
  setel: {
    text: 'Setel Wallet',
    paymentMethodFamily: 'wallet',
    paymentMethodType: 'setel',
    paymentMethodBrand: 'setel',
  },
  visaCard: {
    text: 'VISA',
    paymentMethodFamily: 'wallet',
    paymentMethodType: 'setel',
    paymentMethodBrand: 'visa',
  },
  masterCard: {
    text: 'MasterCard',
    paymentMethodFamily: 'wallet',
    paymentMethodType: 'setel',
    paymentMethodBrand: 'mastercard',
  },
};
