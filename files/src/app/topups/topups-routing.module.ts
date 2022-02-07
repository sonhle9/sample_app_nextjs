import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthResolver} from '../auth.guard';
import {transactionRole} from '../../shared/helpers/roles.type';
import {TopupDetailsComponent} from './pages/topup-details/topup-details.component';
import {TopupListComponent} from './pages/topup-list/topup-list.component';
import {WalletTopupListingComponent} from './pages/wallet-topup-listing.component';
import {WalletTopupDetailsComponent} from './pages/wallet-topup-details.component';

const routes: Routes = [
  {
    path: '',
    component: TopupListComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [transactionRole.view],
    },
  },
  {
    path: 'listing',
    component: WalletTopupListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [transactionRole.view],
    },
  },
  {
    path: 'details/:id',
    component: WalletTopupDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [transactionRole.view],
    },
  },
  {
    path: ':id',
    component: TopupDetailsComponent,
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
export class TopupsRoutingModule {}
