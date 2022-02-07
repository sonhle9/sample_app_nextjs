import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Deliver2MeOrderDetails} from 'src/react/modules/store-orders/components/deliver2me-order-details';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';

@Component({
  selector: 'app-in-car-orders-details',
  template: `<div
    [appReactComponent]="reactComponent"
    [reactProps]="reactProps | async"
    [appBreadcrumbs]="breadcrumbs"
  ></div>`,
})
export class Deliver2MeOrderDetailsComponent {
  reactComponent = Deliver2MeOrderDetails;
  reactProps: Observable<{orderId: string}>;

  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Retail',
    },
    {
      to: '/store-orders',
      label: 'Store orders',
    },
    {
      to: '/store-orders/deliver2me',
      label: 'Deliver2Me',
    },
    {
      label: 'Deliver2Me details',
    },
  ];

  constructor(route: ActivatedRoute) {
    this.reactProps = route.paramMap.pipe(
      map((params) => ({
        orderId: params.get('id'),
      })),
    );
  }
}
