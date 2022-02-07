import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {StoreOrderList} from 'src/react/modules/store-orders/components/store-order-list';

@Component({
  selector: 'app-store-orders-root',
  template: `<div
    [appReactComponent]="reactComponent"
    [reactProps]="reactProps | async"
    [appBreadcrumbs]="breadcrumbs"
  ></div>`,
})
export class StoreOrderListComponent {
  reactComponent = StoreOrderList;
  reactProps: Observable<{tab: string}>;
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Retail',
    },
    {
      label: 'Store orders',
    },
  ];

  constructor(route: ActivatedRoute) {
    this.reactProps = route.paramMap.pipe(
      map((params) => ({
        tab: params.get('tab'),
      })),
    );
  }
}
