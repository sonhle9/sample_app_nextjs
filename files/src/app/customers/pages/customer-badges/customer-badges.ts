import {Component, Input} from '@angular/core';
import {CustomerBadgeList} from 'src/react/modules/badge-campaigns/components/customer-badge-list';
@Component({
  selector: 'app-customer-badges',
  template:
    '<div class="my-8" [appReactComponent]="reactComponent" [reactProps]="{userId: customerId}"></div>',
})
export class CustomerBadgesComponent {
  @Input() customerId;
  reactComponent = CustomerBadgeList;
}
