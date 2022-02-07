import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {FuelOrdersDetails} from 'src/react/modules/fuel-orders';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-order-details',
  template:
    '<div [appReactComponent]="reactComponent" [reactProps]="reactProps | async" [appBreadcrumbs]="breadcrumbs"></div>',
})
export class OrderDetailsComponent {
  reactComponent = FuelOrdersDetails;
  reactProps: Observable<{orderId: string}>;

  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Retail',
    },
    {
      to: 'retail/fuel-orders',
      label: 'Fuel orders',
    },
    {
      label: 'Order details',
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
