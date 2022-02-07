import {BadgeProps} from '@setel/portal-ui';
import {ExternalOrderStatus, PurchaseOrderType} from 'src/react/services/api-external-orders.type';

export const EXTERNAL_ORDER_STATUS_LABELS: Record<keyof typeof ExternalOrderStatus, string> = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  RESOLVED: 'Resolved',
  REJECTED: 'Rejected',
};

export const EXTERNAL_ORDER_PURCHASE_LABELS: Record<keyof typeof PurchaseOrderType, string> = {
  FUEL: 'Fuel',
  STORE: 'Store',
};

export const EXTERNAL_ORDER_STATUS_COLOR: Record<ExternalOrderStatus, BadgeProps['color']> = {
  [ExternalOrderStatus.RESOLVED]: 'success',
  [ExternalOrderStatus.PENDING]: 'lemon',
  [ExternalOrderStatus.PROCESSING]: 'lemon',
  [ExternalOrderStatus.REJECTED]: 'error',
} as const;
