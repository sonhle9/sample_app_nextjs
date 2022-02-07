import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthResolver} from '../auth.guard';
import {merchantRole} from '../../shared/helpers/roles.type';
import {RefundListComponent} from './pages/refund-list/refund-list.component';
import {PaymentsRefundsListingComponent} from './pages/payments-refunds-listing.component';

const routes: Routes = [
  {
    path: '',
    component: RefundListComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [merchantRole.view],
    },
  },
  {
    path: 'listing',
    component: PaymentsRefundsListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [merchantRole.view],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RefundsRoutingModule {}
