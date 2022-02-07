import {Pipe, PipeTransform} from '@angular/core';
import {LoyaltyCardStatusesEnum} from '../enums/loyalty.enum';
import {LOYALTY_CARDS_STATUSES} from 'src/app/stations/shared/const-var';

@Pipe({
  name: 'loyaltyCardStatus',
})
export class LoyaltyCardStatusPipe implements PipeTransform {
  transform(status: LoyaltyCardStatusesEnum): string {
    return LOYALTY_CARDS_STATUSES[status] || status;
  }
}
