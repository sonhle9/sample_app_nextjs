import {Component, Input} from '@angular/core';
import {BreadcrumbItem} from 'src/react/components/app-breadcrumbs';
import {CustomerAccountDetails} from 'src/react/modules/customers/customer-account-details';

@Component({
  selector: 'app-customer-account-details',
  template:
    '<div [appReactComponent]="reactComponent" [reactProps]="{customerID: customerId}" [appBreadcrumbs]="breadcrumbs"></div>',
})
export class CustomerAccountDetailsComponent {
  @Input()
  customerId;
  reactComponent = CustomerAccountDetails;
  breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Users',
    },
    {
      to: '/accounts',
      label: 'Accounts',
    },
    {
      label: 'Account',
    },
  ];
}
