import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ledgerRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {MT940ReportsDetailsComponent} from './pages/mt940-reports-details.component';
import {MT940ReportsListingComponent} from './pages/mt940-reports-listing.component';

const routes: Routes = [
  {
    path: ':account',
    component: MT940ReportsListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [ledgerRole.menu],
    },
  },
  {
    path: ':account/:id',
    component: MT940ReportsDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [ledgerRole.menu],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MT940ReportsRoutingModule {}
