import {Component, Input} from '@angular/core';
import {OverCounterOrderList} from '../../../../react/modules/store-orders/components/over-counter-order-list';

@Component({
  selector: 'app-customer-store-orders',
  template: `<div
    class="mt-10"
    [appReactComponent]="reactComponent"
    [reactProps]="{
      userId: customerId,
      expandable: true,
      hideDownload: true,
      title: 'Over counter orders'
    }"
  ></div>`,
})
export class CustomerStoreOrdersComponent {
  @Input()
  customerId;
  reactComponent = OverCounterOrderList;
}
