import {Component, Input} from '@angular/core';
import {ExternalOrdersAccountCard} from 'src/react/modules/external-orders';

@Component({
  selector: 'app-customer-external-orders',
  template:
    '<div class="mt-10" [appReactComponent]="reactComponent" [reactProps]="{userId: customerId}"></div>',
})
export class CustomerRetailExternalOrdersComponent {
  @Input()
  customerId;
  reactComponent = ExternalOrdersAccountCard;
}
