import {RouterModule, Routes} from '@angular/router';
import {AuthResolver} from '../auth.guard';
import {transactionRole} from '../../shared/helpers/roles.type';
import {NgModule} from '@angular/core';
import {MerchantAdjustmentDetailsComponent} from './pages/merchant-adjustment-details/merchant-adjustment-details.component';
import {AdjustmentViewComponent} from './pages/adjustment-view/adjustment-view.component';
import {CustomerAdjustmentDetailsComponent} from './pages/customer-adjustment-details/customer-adjustment-details.component';
import {PaymentsAdjustmentsListingComponent} from './pages/payments-adjustments-listing.component';
import {PaymentsMerchantAdjustmentDetailsComponent} from './pages/payments-merchant-adjustment-details.component';
import {PaymentsCustomerAdjustmentDetailsComponent} from './pages/payments-customer-adjustment-details.component';

const routes: Routes = [
  {
    path: '',
    component: AdjustmentViewComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [transactionRole.view],
    },
  },
  {
    path: 'listing',
    redirectTo: 'listing/merchant',
  },
  {
    path: 'listing/:tab',
    component: PaymentsAdjustmentsListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [transactionRole.view],
    },
  },
  {
    path: 'details/merchant/:id',
    component: PaymentsMerchantAdjustmentDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [transactionRole.view],
    },
  },
  {
    path: 'details/customer/:id',
    component: PaymentsCustomerAdjustmentDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [transactionRole.view],
    },
  },
  {
    path: 'merchant/:id',
    component: MerchantAdjustmentDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [transactionRole.view],
    },
  },
  {
    path: 'customer/:id',
    component: CustomerAdjustmentDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [transactionRole.view],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdjustmentsRoutingModule {}
