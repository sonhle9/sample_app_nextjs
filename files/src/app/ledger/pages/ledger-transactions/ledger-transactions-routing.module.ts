import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthResolver} from '../../../auth.guard';
import {ledgerRole} from '../../../../shared/helpers/roles.type';
import {LedgerTransactionsListingComponent} from './pages/ledger-transactions-listing.component';
import {LedgerTransactionsDetailsComponent} from './pages/ledger-transactions-details.component';

const routes: Routes = [
  {
    path: '',
    component: LedgerTransactionsListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [ledgerRole.menu, ledgerRole.index],
    },
  },
  {
    path: ':id',
    component: LedgerTransactionsDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [ledgerRole.menu, ledgerRole.read],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LedgerTransactionsRoutingModule {}
