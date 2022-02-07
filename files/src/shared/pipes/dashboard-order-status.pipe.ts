import {Pipe, PipeTransform} from '@angular/core';
import {
  FUEL_ORDER_FULFILL_STARTED_ERROR,
  FUEL_ORDER_FULFILL_CONFIRMATION_ERROR,
  FUEL_ORDER_INIT_ERROR,
  FUEL_ORDER_TRANSACTION_STARTED_ERROR,
  FUEL_ORDER_PRE_AUTH_STARTED_ERROR,
  FUEL_ORDER_CHARGE_ERROR,
  FUEL_ORDER_CONFIRM_ERROR,
  ORDER_ISSUE_LOYALTY_POINTS_ERROR,
  ORDER_CANCELED,
} from 'src/app/stations/shared/const-order-status';

@Pipe({
  name: 'dashboardOrderStatus',
})
export class DashboardOrderStatusPipe implements PipeTransform {
  dashboardStatus = {
    [FUEL_ORDER_INIT_ERROR]: 'Create Order',
    [FUEL_ORDER_TRANSACTION_STARTED_ERROR]: 'Reserve Pump',
    [FUEL_ORDER_PRE_AUTH_STARTED_ERROR]: 'Payment Authorize',
    [FUEL_ORDER_FULFILL_STARTED_ERROR]: 'Fuel Ready',
    [FUEL_ORDER_FULFILL_CONFIRMATION_ERROR]: 'Fuel Complete',
    [FUEL_ORDER_CHARGE_ERROR]: 'Payment Charged',
    [FUEL_ORDER_CONFIRM_ERROR]: 'Order Confirm',
    [ORDER_ISSUE_LOYALTY_POINTS_ERROR]: 'Issue Points',
    [ORDER_CANCELED]: 'Payment Cancel',
  };

  transform(status: string): string {
    return this.dashboardStatus[status] || '';
  }
}
