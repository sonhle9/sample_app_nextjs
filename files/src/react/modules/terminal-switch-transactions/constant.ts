import {BadgeProps, TimelineItemProps} from '@setel/portal-ui';
import {
  CardBrand,
  TerminalSwitchTransactionStatus,
  TerminalSwitchTransactionType,
} from './terminal-switch-transaction.type';

export interface ChooseInterface {
  label: string;
  value: string;
}

export const PaymentPrettyTextMapping: Record<CardBrand, string> = {
  [CardBrand.AMERICAN_EXPRESS]: 'AMEX',
  [CardBrand.MASTER_CARD]: 'Mastercard',
  [CardBrand.MYDEBIT]: 'Mydebit',
  [CardBrand.PETRONAS_GIFT]: 'Gift',
  [CardBrand.PETRONAS_MESRA]: 'Mesra',
  [CardBrand.PETRONAS_SMARTPAY]: 'SmartPay',
  [CardBrand.UNION_PAY]: 'UnionPay',
  [CardBrand.VISA]: 'Visa',
};

const BASE_ASSETS_PAYMENT_URL = 'assets/images/payment-method-logo';

export const PaymentIconMapping: Record<CardBrand, string> = {
  [CardBrand.AMERICAN_EXPRESS]: `${BASE_ASSETS_PAYMENT_URL}/american-express.svg`,
  [CardBrand.MASTER_CARD]: `${BASE_ASSETS_PAYMENT_URL}/mastercard.svg`,
  [CardBrand.MYDEBIT]: `${BASE_ASSETS_PAYMENT_URL}/mydebit.svg`,
  [CardBrand.PETRONAS_GIFT]: `${BASE_ASSETS_PAYMENT_URL}/petronas-gift.svg`,
  [CardBrand.PETRONAS_MESRA]: `${BASE_ASSETS_PAYMENT_URL}/petronas-mesra.svg`,
  [CardBrand.PETRONAS_SMARTPAY]: `${BASE_ASSETS_PAYMENT_URL}/petronas-smart-pay.svg`,
  [CardBrand.UNION_PAY]: `${BASE_ASSETS_PAYMENT_URL}/union-pay.svg`,
  [CardBrand.VISA]: `${BASE_ASSETS_PAYMENT_URL}/visa.svg`,
};

export const TerminalSwitchTransactionStatusMapColor: Record<
  TerminalSwitchTransactionStatus,
  BadgeProps['color'] | TimelineItemProps['color']
> = {
  [TerminalSwitchTransactionStatus.FAILED]: 'error',
  [TerminalSwitchTransactionStatus.PENDING]: 'lemon',
  [TerminalSwitchTransactionStatus.POSTED]: 'success',
  [TerminalSwitchTransactionStatus.REFUNDED]: 'grey',
  [TerminalSwitchTransactionStatus.SETTLED]: 'success',
  [TerminalSwitchTransactionStatus.SUCCEEDED]: 'success',
  [TerminalSwitchTransactionStatus.CLOSED]: 'success',
  [TerminalSwitchTransactionStatus.VOIDED]: 'grey',
  [TerminalSwitchTransactionStatus.AUTHORISED]: 'blue',
  [TerminalSwitchTransactionStatus.UNPOSTED]: 'success',
};

export const TerminalSwitchTransactionTypeTextMapping: Record<
  TerminalSwitchTransactionType,
  string
> = {
  [TerminalSwitchTransactionType.CHARGE]: 'Charge',
  [TerminalSwitchTransactionType.VOID]: 'Void',
  [TerminalSwitchTransactionType.BATCH_UPLOAD]: 'Batch upload',
  [TerminalSwitchTransactionType.TC_UPLOAD]: 'Tc upload',
  [TerminalSwitchTransactionType.REVERSAL]: 'Reversal',
  [TerminalSwitchTransactionType.AUTHORIZE]: 'Authorize',
  [TerminalSwitchTransactionType.CAPTURE]: 'Capture',
  [TerminalSwitchTransactionType.BALANCE_INQUIRY]: 'Balance Inquiry',
  [TerminalSwitchTransactionType.TOP_UP]: 'Top up',
  [TerminalSwitchTransactionType.POINT_ISSUANCE]: 'Point issuance',
  [TerminalSwitchTransactionType.POINT_RETURN]: 'Point return',
  [TerminalSwitchTransactionType.POINT_COMPLETION]: 'Point completion',
};

export const TerminalSwitchTransactionTypeOptions: Array<ChooseInterface> = [
  {
    label: 'All types',
    value: '',
  },
  {
    label: 'Charge',
    value: TerminalSwitchTransactionType.CHARGE,
  },
  {
    label: 'Void',
    value: TerminalSwitchTransactionType.VOID,
  },
  {
    label: 'Batch upload',
    value: TerminalSwitchTransactionType.BATCH_UPLOAD,
  },
  {
    label: 'Tc upload',
    value: TerminalSwitchTransactionType.TC_UPLOAD,
  },
  {
    label: 'Reversal',
    value: TerminalSwitchTransactionType.REVERSAL,
  },
  {
    label: 'Authorize',
    value: TerminalSwitchTransactionType.AUTHORIZE,
  },
  {
    label: 'Capture',
    value: TerminalSwitchTransactionType.CAPTURE,
  },
  {
    label: 'Balance inquiry',
    value: TerminalSwitchTransactionType.BALANCE_INQUIRY,
  },
  {
    label: 'Top up',
    value: TerminalSwitchTransactionType.TOP_UP,
  },
  {
    label: 'Point issuance',
    value: TerminalSwitchTransactionType.POINT_ISSUANCE,
  },
  {
    label: 'Point return',
    value: TerminalSwitchTransactionType.POINT_RETURN,
  },
  {
    label: 'Point completion',
    value: TerminalSwitchTransactionType.POINT_COMPLETION,
  },
];

export const TerminalSwitchTransactionStatusOption: Array<ChooseInterface> = [
  {
    label: 'All status',
    value: '',
  },
  {
    label: 'Succeeded',
    value: TerminalSwitchTransactionStatus.SUCCEEDED,
  },
  {
    label: 'Failed',
    value: TerminalSwitchTransactionStatus.FAILED,
  },
  {
    label: 'Refunded',
    value: TerminalSwitchTransactionStatus.REFUNDED,
  },
  {
    label: 'Closed',
    value: TerminalSwitchTransactionStatus.CLOSED,
  },
  {
    label: 'Settled',
    value: TerminalSwitchTransactionStatus.SETTLED,
  },
  {
    label: 'Posted',
    value: TerminalSwitchTransactionStatus.POSTED,
  },
  {
    label: 'Pending',
    value: TerminalSwitchTransactionStatus.PENDING,
  },
  {
    label: 'Voided',
    value: TerminalSwitchTransactionStatus.VOIDED,
  },
];
