import {Pipe, PipeTransform} from '@angular/core';
import {
  STORE_ORDER_STATUSES,
  StoreOrderStatus,
} from '../../app/store/store-orders/const-store-order-status';

@Pipe({
  name: 'storeOrderStatus',
})
export class StoreOrderStatusPipe implements PipeTransform {
  transform(value: string, detail = false): any {
    value = String(value || '').toUpperCase();

    const orderEnum = Object.keys(STORE_ORDER_STATUSES);
    for (const key of orderEnum) {
      const statuses = STORE_ORDER_STATUSES[key] || [];
      const found = statuses.indexOf(value) !== -1;
      if (!found) {
        continue;
      }

      if (key !== StoreOrderStatus.error) {
        return key;
      }

      return detail ? `${key} (${value})` : value;
    }
    return value;
  }
}
