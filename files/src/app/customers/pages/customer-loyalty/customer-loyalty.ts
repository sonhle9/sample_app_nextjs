import {Component, Input} from '@angular/core';
import {CustomerLoyaltySection} from 'src/react/modules/customers/components/engagement/customer-loyalty';

@Component({
  selector: 'app-customer-loyalty',
  template:
    '<div class="mt-8" [appReactComponent]="reactComponent" [reactProps]="{userId: customerId, customerName:customerName}"></div>',
})
export class CustomerLoyaltyComponent {
  @Input()
  customerId;
  @Input()
  customerName;
  reactComponent = CustomerLoyaltySection;
}
