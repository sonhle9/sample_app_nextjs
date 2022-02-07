import {Component} from '@angular/core';
import {FuelOrdersListing} from 'src/react/modules/fuel-orders';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';

@Component({
  selector: 'app-orders',
  template: '<div [appReactComponent]="reactComponent" [appBreadcrumbs]="breadcrumbs"></div>',
})
export class OrdersComponent {
  reactComponent = FuelOrdersListing;
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Retail',
    },
    {
      label: 'Fuel orders',
    },
  ];
}
