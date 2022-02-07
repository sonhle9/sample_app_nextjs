import {Component, Input} from '@angular/core';
import {CustomerBudget} from 'src/react/modules/customers/components/financial/budget';

@Component({
  selector: 'app-customer-budget',
  template:
    '<div class="my-8" [appReactComponent]="reactComponent" [reactProps]="{userId: customerId}"></div>',
})
export class CustomerFuelBudget {
  @Input()
  customerId;
  reactComponent = CustomerBudget;
}
