import {Pipe, PipeTransform} from '@angular/core';
import {LOYALTY_CARDS_TYPES} from 'src/app/stations/shared/const-var';

@Pipe({
  name: 'loyaltyCardType',
})
export class LoyaltyCardTypePipe implements PipeTransform {
  transform(value: boolean): string {
    return LOYALTY_CARDS_TYPES[`${value}`];
  }
}
