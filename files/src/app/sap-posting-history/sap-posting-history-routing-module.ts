import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {treasuryReportRole, ledgerRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {SAPPostingHistoryDetailsComponent} from './pages/sap-posting-history-details.component';
import {SAPPostingHistoryListingComponent} from './pages/sap-posting-history-listing.component';

const routes: Routes = [
  {
    path: '',
    component: SAPPostingHistoryListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [treasuryReportRole.menu, ledgerRole.menu],
    },
  },
  {
    path: ':id',
    component: SAPPostingHistoryDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [treasuryReportRole.menu, ledgerRole.menu],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SAPPostingHistoryRoutingModule {}
