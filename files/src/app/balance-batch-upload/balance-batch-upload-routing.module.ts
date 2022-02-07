import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {bulkGrantWalletBalanceRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {BalanceBatchUploadComponent} from './pages/balanceBatchUpload/balanceBatchUpload.component';
import {WalletBalanceGrantingListingComponent} from './pages/wallet-balance-granting-listing.component';

const routes: Routes = [
  {
    path: '',
    component: BalanceBatchUploadComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [bulkGrantWalletBalanceRole.menu],
    },
  },
  {
    path: 'beta',
    component: WalletBalanceGrantingListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [bulkGrantWalletBalanceRole.menu],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BalanceBatchUploadRoutingModule {}
