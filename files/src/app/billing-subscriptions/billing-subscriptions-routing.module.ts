import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {billingSubscriptionsRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {BillingSubscriptionsListingComponent} from './components/billing-subscriptions-listing.component';
import {BillingSubscriptionsDetailsComponent} from './components/billing-subscriptions-details.component';

const routes: Routes = [
  {
    path: '',
    component: BillingSubscriptionsListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [billingSubscriptionsRole.view],
    },
  },
  {
    path: ':id',
    component: BillingSubscriptionsDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [billingSubscriptionsRole.view],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingSubscriptionsRoutingModule {}
