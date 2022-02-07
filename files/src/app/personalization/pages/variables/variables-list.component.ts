import {Component} from '@angular/core';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {VariablesList} from 'src/react/modules/variables/components/variables-list';

@Component({
  selector: 'app-variables-list',
  template: '<div [appReactComponent]="reactComponent" [appBreadcrumbs]="breadcrumbs"></div>',
})
export class VariablesListComponent {
  reactComponent = VariablesList;
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Experience',
    },
    {
      to: '/experience/variables',
      label: 'Variables',
    },
  ];
}
