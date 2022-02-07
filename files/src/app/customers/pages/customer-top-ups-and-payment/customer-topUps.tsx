import {Component, Input} from '@angular/core';
import {customerTopUpAndPayments} from 'src/react/modules/customers/components/financial/customer-top-ups';

@Component({
  selector: 'app-customer-topUps-beta',
  template:
    '<div class="my-8" [appReactComponent]="reactComponent" [reactProps]="{userId: customerId}"></div>',
})
export class CustomerTopUpBetaComponent {
  @Input()
  customerId;
  reactComponent = customerTopUpAndPayments;
}
