import {Component, Input} from '@angular/core';
import {CustomerMembership} from 'src/react/modules/customers/components/engagement/customer-membership';

@Component({
  selector: 'app-customer-membership',
  template:
    '<div class="my-8" [appReactComponent]="reactComponent" [reactProps]="{userId: customerId}"></div>',
})
export class CustomerMembershipComponent {
  @Input()
  customerId;
  reactComponent = CustomerMembership;
}
