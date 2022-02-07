import {BadgeProps, DATE_RANGES} from '@setel/portal-ui';
import {BnplAccountBillsStatus, BnplAccountStatus, BnplAccountTransactionsStatus} from './bnpl-account.type';

export const bnplAccountStatusColor: Record<keyof typeof BnplAccountStatus, BadgeProps['color']> = {
  active: 'success',
  inactive: 'grey',
  requires_ekyc: 'warning',
  requires_payment_method: 'warning',
  frozen: 'error',
};

export const bnplAccountBillsStatusColor: Record<keyof typeof BnplAccountBillsStatus, BadgeProps['color']> = {
  uncollectible: 'success',
  voided: 'grey',
  open: 'grey',
  past_due: 'warning',
  paid: 'error',
  refunded: 'error',
  partially_refunded: 'error',
};

export const bnplAccountTransactionsStatusColor: Record<keyof typeof BnplAccountTransactionsStatus, BadgeProps['color']> = {
  success: 'success',
  pending: 'grey',
  failed: 'warning',
};

export const bnplAccountCreditLimitOptions = [
  {
    label: 'Any credit limit',
    value: '',
  },
  {
    label: 'RM1000 and below',
    value: '0,1000',
  },
  {
    label: 'RM1000 to RM3000',
    value: '1000,3000',
  },
];

export const bnplAccountAvailableLimitOptions = [
  {
    label: 'Any available limit',
    value: '',
  },
  {
    label: 'RM1000 and below',
    value: '0,1000',
  },
  {
    label: 'RM1000 to RM3000',
    value: '1000,3000',
  },
];

export const dateOptions = [
  {
    label: 'All date',
    value: DATE_RANGES.anyDate,
  },
  {
    label: 'Last 7 days',
    value: DATE_RANGES.last7days,
  },
  {
    label: 'Last 30 days',
    value: DATE_RANGES.last30days,
  },
];

export const bnplAccountStatusOptions = [
  {value: '', label: 'All status'},
  ...Object.values(BnplAccountStatus).map((value) => ({
    value: Object.keys(BnplAccountStatus)[Object.values(BnplAccountStatus).indexOf(value)],
    label: value,
  })),
];

export const accountStatusOptions = [
  {
    label: BnplAccountStatus.active,
    value: 'active',
  },
  {
    label: BnplAccountStatus.frozen,
    value: 'frozen',
  },
];

export enum PaymentMethodIcon {
  WALLET_SETTEL = '/assets/icons/icon-setel-wallet.png',
  SMARTPAY = '/assets/icons/icon-smartpay.png',
  CARD_VISA = '/assets/icons/icon-visa-card.png',
  CARD_MASTERCARD = '/assets/icons/icon-mastercard-card.png',
  MESRA_CARD = '/assets/icons/icon-mersa-card',
}

export const bnplPaymentMethodIconMap: Record<string, string> = {
  wallet_setel: PaymentMethodIcon.WALLET_SETTEL,
  smartpay: PaymentMethodIcon.SMARTPAY,
  card_visa: PaymentMethodIcon.CARD_VISA,
  mesa_card: PaymentMethodIcon.MESRA_CARD,
  card_mastercard: PaymentMethodIcon.CARD_MASTERCARD,
};
