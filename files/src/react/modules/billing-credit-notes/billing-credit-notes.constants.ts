import {BadgeProps} from '@setel/portal-ui';
import {CreditNotesStatus, CreditNotesType} from './billing-credit-notes.types';

export const creditNotesStatusOptions = [
  {
    label: 'Refunded',
    value: CreditNotesStatus.REFUNDED.toString(),
  },
  {
    label: 'Adjusted',
    value: CreditNotesStatus.ADJUSTED.toString(),
  },
  {
    label: 'Refund due',
    value: CreditNotesStatus.REFUND_DUE.toString(),
  },
  {
    label: 'Voided',
    value: CreditNotesStatus.VOIDED.toString(),
  },
];

export const CreditNotesTypeOptions = [
  {
    label: 'Refundable',
    value: CreditNotesType.REFUNDABLE.toString(),
  },
  {
    label: 'Adjustment',
    value: CreditNotesType.ADJUSTMENT.toString(),
  },
];

export const mappingBillingCreditNotesStatusColor: Record<CreditNotesStatus, BadgeProps['color']> =
  {
    [CreditNotesStatus.REFUNDED]: 'success',
    [CreditNotesStatus.ADJUSTED]: 'lemon',
    [CreditNotesStatus.REFUND_DUE]: 'error',
    [CreditNotesStatus.VOIDED]: 'grey',
  };

export const mappingBillingCreditNotesStatusName = {
  [CreditNotesStatus.REFUNDED]: 'REFUNDED',
  [CreditNotesStatus.ADJUSTED]: 'ADJUSTED',
  [CreditNotesStatus.REFUND_DUE]: 'REFUND DUE',
  [CreditNotesStatus.VOIDED]: 'VOIDED',
};

export const mappingBillingCreditNotesTypeName = {
  [CreditNotesType.REFUNDABLE]: 'Refundable',
  [CreditNotesType.ADJUSTMENT]: 'Adjustment',
};
