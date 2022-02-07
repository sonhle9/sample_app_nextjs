import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ReportsComponent} from './pages/reports/reports';
import {reportRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [reportRole.menu],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
