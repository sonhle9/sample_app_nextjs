import {BadgeProps} from '@setel/portal-ui';

export const defaultPageSettings = {
  defaultPage: 1,
  defaultPerPage: 15,
};

export enum FeeStatus {
  SUCCEEDED = 'SUCCEEDED',
  SETTLED = 'SETTLED',
  BILLED = 'BILLED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
  POSTED = 'POSTED',
  UNPOSTED = 'UNPOSTED',
}

export enum FeeType {
  FEE = 'FEE',
  FEE_REFUND = 'FEE_REFUND',
}

export const FEES_STATUS_COLOR: Record<FeeStatus, BadgeProps['color']> = {
  [FeeStatus.SUCCEEDED]: 'success',
  [FeeStatus.SETTLED]: 'success',
  [FeeStatus.BILLED]: 'success',
  [FeeStatus.REFUNDED]: 'success',
  [FeeStatus.PARTIALLY_REFUNDED]: 'blue',
  [FeeStatus.POSTED]: 'success',
  [FeeStatus.UNPOSTED]: 'error',
};

export const FEE_STATUS_OPTION = [
  {label: 'Succeeded', value: FeeStatus.SUCCEEDED},
  {label: 'Settled', value: FeeStatus.SETTLED},
  {label: 'Billed', value: FeeStatus.BILLED},
  {label: 'Refunded', value: FeeStatus.REFUNDED},
  {label: 'Partially refunded', value: FeeStatus.PARTIALLY_REFUNDED},
  {label: 'Posted', value: FeeStatus.POSTED},
  {label: 'Unposted', value: FeeStatus.UNPOSTED},
];

export const FEES_STATUS_NAME: Record<FeeStatus, string> = {
  [FeeStatus.SUCCEEDED]: FeeStatus.SUCCEEDED,
  [FeeStatus.SETTLED]: FeeStatus.SETTLED,
  [FeeStatus.BILLED]: FeeStatus.BILLED,
  [FeeStatus.REFUNDED]: FeeStatus.REFUNDED,
  [FeeStatus.PARTIALLY_REFUNDED]: FeeStatus.PARTIALLY_REFUNDED,
  [FeeStatus.POSTED]: FeeStatus.POSTED,
  [FeeStatus.UNPOSTED]: FeeStatus.UNPOSTED,
};

export const FEE_TYPE_OPTION = [
  {label: 'Fee', value: FeeType.FEE},
  {label: 'Fee refund', value: FeeType.FEE_REFUND},
];
