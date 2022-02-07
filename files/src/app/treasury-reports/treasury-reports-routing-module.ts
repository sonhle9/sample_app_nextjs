import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ledgerRole, treasuryReportRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {TreasuryReportsDetailsComponent} from './pages/treasury-reports-details.component';
import {TreasuryReportsDownloadComponent} from './pages/treasury-reports-download.component';
import {TreasuryReportsLandingComponent} from './pages/treasury-reports-landing.component';
import {TrusteeReportDetailsComponent} from './pages/trustee/trustee-report-details.component';
import {TrusteeReportComponent} from './pages/trustee/trustee-report.component';

const routes: Routes = [
  {
    path: '',
    component: TreasuryReportsLandingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [treasuryReportRole.menu, ledgerRole.menu],
    },
  },
  {
    path: 'trustee',
    component: TrusteeReportComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [ledgerRole.read],
    },
  },
  {
    path: 'trustee/:id',
    component: TrusteeReportDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [ledgerRole.read],
    },
  },
  {
    path: ':url',
    component: TreasuryReportsDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [treasuryReportRole.view],
    },
  },
  {
    path: ':url/download',
    component: TreasuryReportsDownloadComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [treasuryReportRole.view],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TreasuryReportsRoutingModule {}
