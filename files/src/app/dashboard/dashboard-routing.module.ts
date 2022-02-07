import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from './pages/dashboard/dashboard';
import {dashboardRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [dashboardRole.menu],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
