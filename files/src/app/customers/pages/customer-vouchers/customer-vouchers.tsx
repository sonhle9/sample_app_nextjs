import {Component, Input} from '@angular/core';
import {CustomerVouchers} from 'src/react/modules/customers/components/engagement/customer-vouchers';

@Component({
  selector: 'app-customer-voucher',
  template:
    '<div class="my-8" [appReactComponent]="reactComponent" [reactProps]="{userId: customerId}"></div>',
})
export class CustomerVouchersComponent {
  @Input()
  customerId;
  reactComponent = CustomerVouchers;
}
