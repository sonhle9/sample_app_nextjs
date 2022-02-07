import {Pipe, PipeTransform} from '@angular/core';
import {CONCIERGE_ORDER_STATUSES} from '../../app/store/store-orders/const-store-order-status';

@Pipe({
  name: 'conciergeOrderStatusCss',
})
export class ConciergeOrderStatusCssPipe implements PipeTransform {
  transform(value: string): string {
    const key = CONCIERGE_ORDER_STATUSES[value];

    switch (key) {
      case CONCIERGE_ORDER_STATUSES.created:
        return 'pending';

      case CONCIERGE_ORDER_STATUSES.chargeError:
      case CONCIERGE_ORDER_STATUSES.pointIssuanceError:
      case CONCIERGE_ORDER_STATUSES.pointVoidError:
      case CONCIERGE_ORDER_STATUSES.voidError:
      case CONCIERGE_ORDER_STATUSES.CancelError:
        return 'fail';

      case CONCIERGE_ORDER_STATUSES.chargeSuccess:
      case CONCIERGE_ORDER_STATUSES.delivered:
      case CONCIERGE_ORDER_STATUSES.pointIssuanceSuccess:
        return 'success';

      default:
        return '';
    }
  }
}
