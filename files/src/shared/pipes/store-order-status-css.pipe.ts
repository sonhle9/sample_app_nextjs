import {Pipe, PipeTransform} from '@angular/core';
import {
  STORE_ORDER_STATUSES,
  StoreOrderStatus,
} from '../../app/store/store-orders/const-store-order-status';

@Pipe({
  name: 'storeOrderStatusCss',
})
export class StoreOrderStatusCssPipe implements PipeTransform {
  transform(value: string): string {
    value = String(value || '').toUpperCase();

    const orderEnum = Object.keys(STORE_ORDER_STATUSES);
    for (const key of orderEnum) {
      const statuses = STORE_ORDER_STATUSES[key] || [];
      const found = statuses.indexOf(value) !== -1;
      if (!found) {
        continue;
      }

      switch (key) {
        case StoreOrderStatus.created:
          return 'pending';

        case StoreOrderStatus.error:
        case StoreOrderStatus.errorCharge:
        case StoreOrderStatus.errorPointIssuance:
        case StoreOrderStatus.errorVoid:
          return 'fail';

        case StoreOrderStatus.confirmed:
        case StoreOrderStatus.successfulCharge:
        case StoreOrderStatus.successfulPointIssuance:
          return 'success';

        case StoreOrderStatus.successfulVoid:
          return 'refund';

        default:
          return '';
      }
    }
    return '';
  }
}
