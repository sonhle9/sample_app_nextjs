import {NestedOption} from '@setel/portal-ui';
import {CardBrand} from '../terminal-switch-transactions/terminal-switch-transaction.type';

export const CARD_OPTIONS_NAME: Partial<Record<CardBrand, string>> = {
  [CardBrand.VISA]: 'Visa',
  [CardBrand.MASTER_CARD]: 'Mastercard',
  [CardBrand.AMERICAN_EXPRESS]: 'Amex',
  [CardBrand.MYDEBIT]: 'Debit',
  [CardBrand.PETRONAS_SMARTPAY]: 'Petronas Smartpay',
  [CardBrand.PETRONAS_MESRA]: 'Petronas Mesra',
  [CardBrand.PETRONAS_GIFT]: 'Petronas Gift',
};

export const MonthlyCardSalesReportCardTypeOptions: NestedOption<string, string>[] = [
  {
    value: '',
    label: 'Any card types',
  },
  {
    value: CardBrand.VISA,
    label: CARD_OPTIONS_NAME[CardBrand.VISA],
  },
  {
    value: CardBrand.MASTER_CARD,
    label: CARD_OPTIONS_NAME[CardBrand.MASTER_CARD],
  },
  {
    value: CardBrand.AMERICAN_EXPRESS,
    label: CARD_OPTIONS_NAME[CardBrand.AMERICAN_EXPRESS],
  },
  {
    value: CardBrand.MYDEBIT,
    label: CARD_OPTIONS_NAME[CardBrand.MYDEBIT],
  },
  {
    value: CardBrand.PETRONAS_SMARTPAY,
    label: CARD_OPTIONS_NAME[CardBrand.PETRONAS_SMARTPAY],
  },
  {
    value: CardBrand.PETRONAS_MESRA,
    label: CARD_OPTIONS_NAME[CardBrand.PETRONAS_MESRA],
  },
  {
    value: CardBrand.PETRONAS_GIFT,
    label: CARD_OPTIONS_NAME[CardBrand.PETRONAS_GIFT],
  },
];

export const HEADER_MONTHLY_CARD_SALE_REPORT_MAPPER: Partial<Record<CardBrand, string[]>> = {
  [CardBrand.MASTER_CARD]: ['Mastercard', 'Mastercard (CB)'],
  [CardBrand.VISA]: ['Visa card', 'Visa card (CB)'],
  [CardBrand.MYDEBIT]: ['Debit card'],
  [CardBrand.AMERICAN_EXPRESS]: ['AMEX card'],
  [CardBrand.PETRONAS_SMARTPAY]: ['Fleet card'],
  [CardBrand.PETRONAS_MESRA]: ['Loyalty card'],
  [CardBrand.PETRONAS_GIFT]: ['Gift card'],
};

export const DEFAULT_COL_WIDTH = 'w-48';
