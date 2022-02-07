import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {onDemandReportConfigAccess} from 'src/shared/helpers/pdb.roles.type';
import {AuthResolver} from '../auth.guard';
import {OnDemandReportsDetailsComponent} from './pages/on-demand-reports-details.component';
import {OnDemandReportsListingComponent} from './pages/on-demand-reports-listing.component';

const routes: Routes = [
  {
    path: '',
    component: OnDemandReportsListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [onDemandReportConfigAccess.read],
    },
  },
  {
    path: ':id',
    component: OnDemandReportsDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [onDemandReportConfigAccess.read],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnDemandReportsRoutingModule {}
