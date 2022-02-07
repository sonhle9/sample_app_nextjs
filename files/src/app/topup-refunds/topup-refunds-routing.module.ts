import {RouterModule, Routes} from '@angular/router';
import {AuthResolver} from '../auth.guard';
import {transactionRole} from '../../shared/helpers/roles.type';
import {NgModule} from '@angular/core';
import {TopupRefundListComponent} from './pages/topup-refund-list/topup-refund-list.component';
import {TopupRefundDetailsComponent} from './pages/topup-refund-details/topup-refund-details.component';
import {TopupRefundDetailsComponent as NewTopupRefundDetailsComponent} from './pages/topup-refund-details.component';
import {TopupRefundListingComponent} from './pages/topup-refund-listing.component';

const routes: Routes = [
  {
    path: '',
    component: TopupRefundListComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [transactionRole.view],
    },
  },
  {
    path: 'listing',
    component: TopupRefundListingComponent,
    data: {
      roles: [transactionRole.view],
    },
  },
  {
    path: 'details/:id',
    component: NewTopupRefundDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [transactionRole.view],
    },
  },
  {
    path: ':id',
    component: TopupRefundDetailsComponent,
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
export class TopupRefundsRoutingModule {}
