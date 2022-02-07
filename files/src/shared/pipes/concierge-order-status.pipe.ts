import {Pipe, PipeTransform} from '@angular/core';
import {CONCIERGE_ORDER_STATUSES} from '../../app/store/store-orders/const-store-order-status';

@Pipe({
  name: 'conciergeOrderStatus',
})
export class ConciergeOrderStatusPipe implements PipeTransform {
  transform(value: string, detail = false): any {
    return detail
      ? `${CONCIERGE_ORDER_STATUSES[value]} (${detail})`
      : CONCIERGE_ORDER_STATUSES[value];
  }
}
