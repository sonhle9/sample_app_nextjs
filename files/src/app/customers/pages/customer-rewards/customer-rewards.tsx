import {Component, Input} from '@angular/core';
import {CustomerRewards} from 'src/react/modules/customers/components/engagement/customer-rewards';

@Component({
  selector: 'app-customer-rewards',
  template:
    '<div class="my-8" [appReactComponent]="reactComponent" [reactProps]="{userId: customerId}"></div>',
})
export class CustomerRewardsComponent {
  @Input()
  customerId;
  reactComponent = CustomerRewards;
}
