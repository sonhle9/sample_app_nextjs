import {Component, Input} from '@angular/core';
import {Deliver2MeOrderList} from '../../../../react/modules/store-orders/components/deliver2me-order-list';

@Component({
  selector: 'app-customer-deliver2me-orders',
  template: `<div
    class="mt-10"
    [appReactComponent]="reactComponent"
    [reactProps]="{
      userId: customerId,
      title: 'Deliver2Me orders',
      expandable: true,
      hideDownload: true
    }"
  ></div>`,
})
export class CustomerDeliver2meOrdersComponent {
  @Input()
  customerId;
  reactComponent = Deliver2MeOrderList;
}
