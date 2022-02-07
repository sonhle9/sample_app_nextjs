import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthResolver} from 'src/app/auth.guard';
import {cardReportAccess} from 'src/shared/helpers/pdb.roles.type';
import {ExpiredCardBalanceSummaryListComponent} from './expired-card-balance-summary-list.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthResolver],
    component: ExpiredCardBalanceSummaryListComponent,
    data: {
      roles: [cardReportAccess.menu],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpiredCardBalanceSummaryRoutingModule {}
