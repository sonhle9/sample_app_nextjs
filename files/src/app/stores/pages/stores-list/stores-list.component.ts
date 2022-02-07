import {Component} from '@angular/core';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {StoreList} from 'src/react/modules/stores/components/store-list';

@Component({
  selector: 'app-stores-list',
  template: '<div [appReactComponent]="reactComponent" [appBreadcrumbs]="breadcrumbs"></div>',
  styleUrls: [],
})
export class StoresListComponent {
  reactComponent = StoreList;

  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Retail',
    },
    {
      label: 'Stores',
    },
  ];
}
