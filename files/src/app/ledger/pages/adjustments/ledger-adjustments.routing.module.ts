import {RouterModule, Routes} from '@angular/router';
import {AuthResolver} from '../../../auth.guard';
import {NgModule} from '@angular/core';
import {ledgerRole} from '../../../../shared/helpers/roles.type';
import {LedgerAdjustmentsListComponent} from './components/ledger-adjustment/ledger-adjustments-list.component';
import {LedgerAdjustmentDetailsComponent} from './components/ledger-adjustment/ledger-adjustment-details.component';

const routes: Routes = [
  {
    path: '',
    component: LedgerAdjustmentsListComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [ledgerRole.menu, ledgerRole.index],
    },
  },
  {
    path: ':id',
    component: LedgerAdjustmentDetailsComponent,
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
export class LedgerAdjustmentsRoutingModule {}
