import {Component, Input} from '@angular/core';
import {CustomerFraudProfile} from 'src/react/modules/customers/components/financial/customer-fraud-profile';

@Component({
  selector: 'app-customer-fraud-profile',
  template:
    '<div class="mt-10" [appReactComponent]="reactComponent" [reactProps]="{userId: userId}"></div>',
})
export class CustomerFraudProfileComponent {
  @Input()
  userId;
  reactComponent = CustomerFraudProfile;
}
