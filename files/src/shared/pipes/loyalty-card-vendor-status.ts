import {Pipe, PipeTransform} from '@angular/core';
import {LoyaltyCardVendorStatusesEnum} from '../enums/loyalty.enum';
import {LOYALTY_CARDS_VENDOR_STATUSES} from 'src/app/stations/shared/const-var';

@Pipe({
  name: 'loyaltyCardVendorStatus',
})
export class LoyaltyCardVendorStatusPipe implements PipeTransform {
  transform(status: LoyaltyCardVendorStatusesEnum): string {
    return LOYALTY_CARDS_VENDOR_STATUSES[status] || status;
  }
}
