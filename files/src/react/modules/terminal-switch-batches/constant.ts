import {PaymentPrettyTextMapping} from '../terminal-switch-transactions/constant';
import {CardBrand} from '../terminal-switch-transactions/terminal-switch-transaction.type';
import {BatchStatus} from './terminal-switch-batches.type';

export const TerminalSwitchBatchStatusOptions: Array<{
  label: string;
  value: string;
}> = [
  {
    label: 'All statuses',
    value: '',
  },
  {
    label: 'Open',
    value: BatchStatus.OPEN,
  },
  {
    label: 'Closed',
    value: BatchStatus.CLOSED,
  },
];

export enum AcquirerType {
  MAYBANK = 'maybank',
  CIMB = 'cimb',
  GIFT = 'gift',
  LOYALTY = 'loyalty',
  FLEET = 'fleet',
}

export const AcquirerType2Text: Record<AcquirerType, string> = {
  [AcquirerType.MAYBANK]: 'Maybank',
  [AcquirerType.CIMB]: 'Cimb',
  [AcquirerType.GIFT]: 'PDB Gift',
  [AcquirerType.LOYALTY]: 'PDB Loyalty',
  [AcquirerType.FLEET]: 'PDB Fleet',
};

export const CardBrand2Text: Record<CardBrand, string> = {
  [CardBrand.AMERICAN_EXPRESS]: 'AMEX',
  [CardBrand.MASTER_CARD]: 'Mastercard',
  [CardBrand.MYDEBIT]: 'Mydebit',
  [CardBrand.PETRONAS_GIFT]: 'Gift',
  [CardBrand.PETRONAS_MESRA]: 'Mesra',
  [CardBrand.PETRONAS_SMARTPAY]: 'SmartPay',
  [CardBrand.UNION_PAY]: 'UnionPay',
  [CardBrand.VISA]: 'Visa',
};

export const AcquirerTypeOptions: Array<{
  label: string;
  value: string;
}> = [
  {
    label: 'All acquirer types',
    value: '',
  },
  {
    label: AcquirerType2Text[AcquirerType.MAYBANK],
    value: AcquirerType.MAYBANK,
  },
  {
    label: AcquirerType2Text[AcquirerType.CIMB],
    value: AcquirerType.CIMB,
  },
  {
    label: AcquirerType2Text[AcquirerType.GIFT],
    value: AcquirerType.GIFT,
  },
  {
    label: AcquirerType2Text[AcquirerType.LOYALTY],
    value: AcquirerType.LOYALTY,
  },
  {
    label: AcquirerType2Text[AcquirerType.FLEET],
    value: AcquirerType.FLEET,
  },
];

export const CardBrandOptions: Array<{
  label: string;
  value: string;
}> = [
  {
    label: 'All card brands',
    value: '',
  },
  {
    label: PaymentPrettyTextMapping[CardBrand.AMERICAN_EXPRESS],
    value: CardBrand.AMERICAN_EXPRESS,
  },
  {
    label: PaymentPrettyTextMapping[CardBrand.MASTER_CARD],
    value: CardBrand.MASTER_CARD,
  },
  {
    label: PaymentPrettyTextMapping[CardBrand.MYDEBIT],
    value: CardBrand.MYDEBIT,
  },
  {
    label: PaymentPrettyTextMapping[CardBrand.PETRONAS_GIFT],
    value: CardBrand.PETRONAS_GIFT,
  },
  {
    label: PaymentPrettyTextMapping[CardBrand.PETRONAS_MESRA],
    value: CardBrand.PETRONAS_MESRA,
  },
  {
    label: PaymentPrettyTextMapping[CardBrand.PETRONAS_SMARTPAY],
    value: CardBrand.PETRONAS_SMARTPAY,
  },
  {
    label: PaymentPrettyTextMapping[CardBrand.UNION_PAY],
    value: CardBrand.UNION_PAY,
  },
  {
    label: PaymentPrettyTextMapping[CardBrand.VISA],
    value: CardBrand.VISA,
  },
];
