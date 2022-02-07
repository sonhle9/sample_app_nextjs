import {BadgeProps, IndicatorProps} from '@setel/portal-ui';
import {OrderStatusFilterOptions} from './fuel-orders.type';

export const FUEL_STATUS_DROPDOWN_OPTIONS: Array<{
  label: string;
  value: string;
}> = [
  {value: OrderStatusFilterOptions.cancelled, label: 'Cancelled'},
  {value: OrderStatusFilterOptions.confirmed, label: 'Confirmed'},
  {value: OrderStatusFilterOptions.created, label: 'Created'},
  {value: OrderStatusFilterOptions.error, label: 'Error'},
  {
    value: OrderStatusFilterOptions.fulfillmentError,
    label: 'Fuel fulfillment error',
  },
  {
    value: OrderStatusFilterOptions.fulfillmentReady,
    label: 'Fuel fulfillment ready',
  },
  {
    value: OrderStatusFilterOptions.fulfillmentStarted,
    label: 'Fuel fulfillment started',
  },
  {
    value: OrderStatusFilterOptions.fulfillmentSuccess,
    label: 'Fuel fulfillment success',
  },
  {value: OrderStatusFilterOptions.fulfilled, label: 'Fulfilled'},
];

export const FUEL_ORDER_FILTERS_PAYMENT_METHODS = [
  {
    label: 'Setel Wallet',
    value: 'wallet',
  },
  {
    label: 'Smartpay',
    value: 'smartpay',
  },
  {
    label: 'Boost',
    value: 'boost',
  },
  {
    label: 'Card',
    value: 'card',
  },
];

export const fuelOrdersReportConfig = {
  reportCategory: 'NONE',
  reportPrefixUrl: 'fuel-report',
  reportName: `Merchant's fuel orders(admin portal)`,
};

export const colorByStatus: Record<string, BadgeProps['color']> = {
  success: 'success',
  error: 'error',
  pending: 'lemon',
};

export const colorByStatusTimeline: Record<string, IndicatorProps['color']> = {
  authorize: 'blue',
  capture: 'success',
  purchase: 'success',
  cancel: 'grey',
  reversed: 'grey',
};

export const mapTransactionTypeToFriendlyName = {
  CAPTURE: 'Captured',
  AUTHORIZE: 'Authorised',
  CANCEL: 'Canceled',
  REVERSED: 'Canceled',
  PURCHASE: 'Purchased',
};
