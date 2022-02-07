import {Component, Input} from '@angular/core';
import {CustomerTreasury} from 'src/react/modules/customers/components/financial/customer-treasury';

@Component({
  selector: 'app-customer-treasury-component',
  template:
    '<div class="my-8" [appReactComponent]="reactComponent" [reactProps]="{userId: customerId, walletId: walletId}"></div>',
})
export class CustomerTreasuryComponent {
  @Input()
  customerId;

  @Input()
  walletId;
  reactComponent = CustomerTreasury;
}
