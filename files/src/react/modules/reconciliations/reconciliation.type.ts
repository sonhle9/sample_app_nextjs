import {BadgeProps} from '@setel/portal-ui';
import {SettlementType} from 'src/react/services/api-settlements.type';

export const defaultSettingReconciliationPage = {
  defaultPage: 1,
  defaultPerPage: 50,
};

export const ReconciliationStatusOptions = [
  {label: 'Succeeded', value: 'succeeded'},
  {label: 'Failed', value: 'failed'},
];

export const ReconciliationTypeOptions = [
  {label: 'Initial', value: 'INITIAL'},
  {label: 'Batch upload', value: 'BATCH_UPLOAD'},
];

export enum ReconciliationStatus {
  FAILED = 'FAILED',
  SUCCEEDED = 'SUCCEEDED',
}

export const ReconciliationStatusColorMap: Record<ReconciliationStatus, BadgeProps['color']> = {
  [ReconciliationStatus.SUCCEEDED]: 'success',
  [ReconciliationStatus.FAILED]: 'error',
};

export const ReconciliationsType = [
  {label: 'Succeeded', value: true, filter: 'succeeded'},
  {label: 'Failed', value: false, filter: 'failed'},
  {label: 'All status', value: undefined, filter: ''},
];

export const getReconAmountFields = (type: SettlementType) => {
  switch (type) {
    case SettlementType.LOYALTY_CARD:
      return {
        totalNetPurchaseCount: 'Total net redemption count',
        totalNetPurchaseAmount: 'Total net redemption amount',
        totalNetTopupCount: 'Total net point issuance',
        totalNetTopupAmount: 'Total net point issuance amount',
      };
    default:
      return {
        totalNetPurchaseCount: 'Total net purchase count',
        totalNetPurchaseAmount: 'Total net purchase amount',
        totalNetTopupCount: 'Total net top-up count',
        totalNetTopupAmount: 'Total net top-up amount',
      };
  }
};
