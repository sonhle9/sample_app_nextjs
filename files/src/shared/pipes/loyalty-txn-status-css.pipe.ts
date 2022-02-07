import {Pipe, PipeTransform} from '@angular/core';
import {LoyaltyTransactionStatusesEnum} from '../enums/loyalty.enum';

@Pipe({
  name: 'loyaltyTxnStatusCss',
})
export class LoyaltyTxnStatusCssPipe implements PipeTransform {
  transform(value: LoyaltyTransactionStatusesEnum): string {
    switch (value) {
      case LoyaltyTransactionStatusesEnum.failed:
        return 'fail';

      case LoyaltyTransactionStatusesEnum.successful:
        return 'success';
    }

    return 'pending';
  }
}
