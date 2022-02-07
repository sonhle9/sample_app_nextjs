import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ledgerRole} from '../../../../shared/helpers/roles.type';
import {AuthResolver} from '../../../auth.guard';
import {PayablesDetailComponent} from './pages/payables-details/payables-detail.component';
import {PayablesReportComponent} from './pages/payables/payables.component';
import {PayoutProjectionComponent} from './pages/payout-projection/payout-projection.component';
import {ReceivablesDetailsComponent} from './pages/receivables-details/receivables-details.component';
import {ReceivablesListComponent} from './pages/receivables/receivables-list.component';

const routes: Routes = [
  {
    path: 'payables',
    component: PayablesReportComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [ledgerRole.menu, ledgerRole.index],
    },
  },
  {
    path: 'payables/:id',
    component: PayablesDetailComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [ledgerRole.menu, ledgerRole.index],
    },
  },
  {
    path: 'receivables',
    component: ReceivablesListComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [ledgerRole.menu, ledgerRole.index],
    },
  },
  {
    path: 'receivables/:id',
    component: ReceivablesDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [ledgerRole.menu, ledgerRole.index],
    },
  },
  {
    path: 'payout-projection',
    component: PayoutProjectionComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [ledgerRole.menu, ledgerRole.index],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
