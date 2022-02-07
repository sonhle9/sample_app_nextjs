import {Pipe, PipeTransform} from '@angular/core';
import {OrderStatus, ORDER_STATUSES} from '../../app/stations/shared/const-order-status';

@Pipe({
  name: 'orderStatus',
})
export class OrderStatusPipe implements PipeTransform {
  transform(value: string, detail = false): any {
    value = String(value || '').toUpperCase();

    const orderEnum = Object.keys(ORDER_STATUSES);
    for (const key of orderEnum) {
      const statuses = ORDER_STATUSES[key] || [];
      const found = statuses.indexOf(value) !== -1;
      if (!found) {
        continue;
      }

      if (key !== OrderStatus.error) {
        return key;
      }

      return detail ? `${key} (${value})` : value;
    }
    return value;
  }
}
