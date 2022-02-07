import {Component} from '@angular/core';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {AttributionList} from 'src/react/modules/attribution/components/attribution-list';

@Component({
  selector: 'app-attribution',
  template: '<div [appReactComponent]="reactComponent" [appBreadcrumbs]="breadcrumbs"></div>',
})
export class AttributionComponent {
  reactComponent = AttributionList;
  breadcrumbs: BreadcrumbItem[] = [
    {
      to: '/attribution',
      label: 'Attribution',
    },
    {
      label: 'Attribution rules',
    },
  ];
}
