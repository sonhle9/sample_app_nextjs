import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {WaitingAreasListComponent} from './pages/waiting-areas-list/waiting-areas-list.component';
import {AuthResolver} from '../auth.guard';
import {retailRoles} from '../../shared/helpers/roles.type';
import {WaitingAreaDetailsComponent} from './pages/waiting-area-details/waiting-area-details.component';

const routes: Routes = [
  {
    path: '',
    component: WaitingAreasListComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [retailRoles.waitingAreaView],
    },
  },
  {
    path: ':id',
    canActivate: [AuthResolver],
    data: {
      roles: [retailRoles.waitingAreaView],
    },
    children: [
      {
        path: '',
        component: WaitingAreaDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingAreasRoutingModule {}
