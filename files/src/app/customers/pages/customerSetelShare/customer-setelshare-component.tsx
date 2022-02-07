import {Component, Input} from '@angular/core';
import {CustomerSetelShare} from 'src/react/modules/customers/components/financial/customer-setelshare';

@Component({
  selector: 'app-customer-setelshare-component',
  template:
    '<div class="my-8" [appReactComponent]="reactComponent" [reactProps]="{userId: customerId}"></div>',
})
export class CustomerSetelShareComponent {
  @Input()
  customerId;
  reactComponent = CustomerSetelShare;
}
