import {Component} from '@angular/core';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {WaitingAreaList} from 'src/react/modules/waiting-areas/components/waiting-area-list';

@Component({
  selector: 'app-waiting-areas-list',
  template: '<div [appReactComponent]="reactComponent" [appBreadcrumbs]="breadcrumbs"></div>',
  styleUrls: [],
})
export class WaitingAreasListComponent {
  reactComponent = WaitingAreaList;

  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Retail',
    },
    {
      label: 'Waiting areas',
    },
  ];
}
