import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {OverCounterOrderDetails} from 'src/react/modules/store-orders/components/over-counter-order-details';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';

@Component({
  selector: 'app-store-order-details',
  template: `<div
    [appReactComponent]="reactComponent"
    [reactProps]="reactProps | async"
    [appBreadcrumbs]="breadcrumbs"
  ></div>`,
})
export class OverCounterOrderDetailsComponent {
  reactComponent = OverCounterOrderDetails;
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
      to: '/store-orders/over-counter',
      label: 'Over counter',
    },
    {
      label: 'Over counter details',
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
