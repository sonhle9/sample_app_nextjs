import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {rebateReportRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {RebateReportsComponent} from './components/rebate-plans-listing.component';
import {ReportsComponent} from './components/reports.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [rebateReportRole.view],
    },
  },
  {
    path: 'rebate-reports',
    component: RebateReportsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [rebateReportRole.view],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
