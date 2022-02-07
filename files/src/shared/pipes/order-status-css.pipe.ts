import {Pipe, PipeTransform} from '@angular/core';
import {ORDER_STATUSES, OrderStatus} from '../../app/stations/shared/const-order-status';

@Pipe({
  name: 'orderStatusCss',
})
export class OrderStatusCssPipe implements PipeTransform {
  transform(value: string): string {
    value = String(value || '').toUpperCase();

    const orderEnum = Object.keys(ORDER_STATUSES);
    for (const key of orderEnum) {
      const statuses = ORDER_STATUSES[key] || [];
      const found = statuses.indexOf(value) !== -1;
      if (!found) {
        continue;
      }

      switch (key) {
        case OrderStatus.created:
        case OrderStatus.fulfillmentReady:
        case OrderStatus.fulfillmentStarted:
        case OrderStatus.fulfillmentSuccess:
        case OrderStatus.fulfilled:
          return 'pending';

        case OrderStatus.error:
        case OrderStatus.fulfillmentError:
          return 'fail';

        case OrderStatus.confirmed:
          return 'success';

        case OrderStatus.cancelled:
        case OrderStatus.refund:
          return 'refund';

        default:
          return '';
      }
    }
    return '';
  }
}
