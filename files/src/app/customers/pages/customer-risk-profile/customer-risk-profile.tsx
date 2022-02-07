import {Component, Input} from '@angular/core';
import {CustomerRiskProfile} from 'src/react/modules/customers/components/financial/customer-risk-profile';

@Component({
  selector: 'app-customer-risk-profile',
  template:
    '<div class="mt-10" [appReactComponent]="reactComponent" [reactProps]="{userId: userId}"></div>',
})
export class CustomerRiskProfileComponent {
  @Input()
  userId;
  reactComponent = CustomerRiskProfile;
}
