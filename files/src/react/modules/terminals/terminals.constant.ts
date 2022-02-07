import {BadgeProps} from '@setel/portal-ui';
import {CardBrand} from '@setel/payment-interfaces';

export enum TerminalStatus {
  ACTIVE = 'ACTIVE',
  NEW = 'NEW',
  SUSPENDED = 'SUSPENDED',
  TERMINATED = 'TERMINATED',
}

export const TerminalStatusOptions = [
  {label: 'ACTIVE', value: 'ACTIVE'},
  {label: 'NEW', value: 'NEW'},
  {label: 'SUSPENDED', value: 'SUSPENDED'},
  {label: 'TERMINATED', value: 'TERMINATED'},
];

export const CreateTerminalStatus = ['ACTIVE', 'NEW'];
export const CreateTerminalStatusOptions = [
  {label: 'ACTIVE', value: 'ACTIVE'},
  {label: 'NEW', value: 'NEW'},
];

export const TerminalType = [
  'EDC',
  'IPT',
  'OPT',
  'PDT',
  'Pos Register',
  'Imprinted Machine',
  'CAT',
  'Printer',
  'PIN PAD',
];
export const TerminalTypeOptions = [
  {label: 'EDC', value: 'EDC'},
  {label: 'IPT', value: 'IPT'},
  {label: 'OPT', value: 'OPT'},
];

export const TerminalStatusColorMap: Record<TerminalStatus, BadgeProps['color']> = {
  [TerminalStatus.ACTIVE]: 'turquoise',
  [TerminalStatus.NEW]: 'blue',
  [TerminalStatus.SUSPENDED]: 'error',
  [TerminalStatus.TERMINATED]: 'grey',
};

export const TerminalReasons = [
  'Power supply defect',
  'Missing piece, falls, plastics damaged',
  'Rechargeable battery failure',
  'Dropping the device',
];

export enum AcquirerStatus {
  ACTIVE = 'ACTIVE',
  DEACTIVE = 'DEACTIVE',
}

export enum AcquirerType {
  MAYBANK = 'maybank',
  CIMB = 'cimb',
  GIFT = 'gift',
  LOYALTY = 'loyalty',
  FLEET = 'fleet',
}

export const AcquirerTypeOptions = [
  {label: 'Maybank', value: AcquirerType.MAYBANK},
  {label: 'Cimb', value: AcquirerType.CIMB},
];

export const CardBrandOptions = [
  {label: 'Visa', value: CardBrand.VISA},
  {label: 'AMEX', value: CardBrand.AMERICAN_EXPRESS},
  {label: 'Mydebit', value: CardBrand.MYDEBIT},
  {label: 'Mastercard', value: CardBrand.MASTER_CARD},
];

export const CloseLoopCardAcquirerTypes = [
  AcquirerType.GIFT,
  AcquirerType.LOYALTY,
  AcquirerType.FLEET,
];
