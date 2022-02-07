import {Pipe, PipeTransform} from '@angular/core';
import {LoyaltyCardIssuersEnum} from '../enums/loyalty.enum';
import {LOYALTY_CARD_ISSUE_BY} from 'src/app/stations/shared/const-var';

@Pipe({
  name: 'loyaltyTxnIssuedBy',
})
export class LoyaltyTxnIssuedBy implements PipeTransform {
  transform(value: LoyaltyCardIssuersEnum): string {
    return LOYALTY_CARD_ISSUE_BY[value] || value;
  }
}
