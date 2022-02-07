import {Component, Input} from '@angular/core';
import {FuelOrdersAccountCard} from 'src/react/modules/fuel-orders';

@Component({
  selector: 'app-customer-fuel-orders',
  template:
    '<div class="mt-10" [appReactComponent]="reactComponent" [reactProps]="{userId: customerId}"></div>',
})
export class CustomerFuelOrdersComponent {
  @Input()
  customerId;
  reactComponent = FuelOrdersAccountCard;
}
