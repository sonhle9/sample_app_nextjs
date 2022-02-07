import {Component, Input} from '@angular/core';
import {CustomerDataPlatform} from 'src/react/modules/customers';

@Component({
  selector: 'app-customer-data-platform',
  template:
    '<div class="my-8" [appReactComponent]="reactComponent" [reactProps]="{userId: customerId}"></div>',
})
export class CustomerDataPlatformComponent {
  @Input()
  customerId;
  reactComponent = CustomerDataPlatform;
}
