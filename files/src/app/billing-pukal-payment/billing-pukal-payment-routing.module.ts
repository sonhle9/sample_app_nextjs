import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {billingPukalPaymentRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {BillingPukalPaymentAllocationComponent} from './components/billing-pukal-payment-allocation.component';
import {BillingPukalPaymentDetailComponent} from './components/billing-pukal-payment-detail.component';
import {BillingPukalPaymentListingComponent} from './components/billing-pukal-payment-listing.component';

const routes: Routes = [
  {
    path: '',
    component: BillingPukalPaymentListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [billingPukalPaymentRole.view],
    },
  },
  {
    path: ':id',
    component: BillingPukalPaymentDetailComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [billingPukalPaymentRole.view],
    },
  },
  {
    path: ':id/allocation',
    component: BillingPukalPaymentAllocationComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [billingPukalPaymentRole.view],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingPukalPaymentRoutingModule {}
