import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {merchantRole} from '../../shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {PaymentsTransfersDetailsComponent} from './pages/payments-transfers-details.component';
import {PaymentsTransfersListingComponent} from './pages/payments-transfers-listing.component';
import {TransferDetailsComponent} from './pages/transfer-details/transfer-details.component';
import {TransferListComponent} from './pages/transfer-list/transfer-list.component';

const routes: Routes = [
  {
    path: '',
    component: TransferListComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [merchantRole.view],
    },
  },
  {
    path: 'listing',
    component: PaymentsTransfersListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [merchantRole.view],
    },
  },
  {
    path: 'details/:id',
    component: PaymentsTransfersDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [merchantRole.view],
    },
  },
  {
    path: ':id',
    component: TransferDetailsComponent,
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
export class TransferRoutingModule {}
