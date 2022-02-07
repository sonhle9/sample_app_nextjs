import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {adminCircles} from '../../shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {SetelShareDetailsComponent} from './pages/setelshare-details.component';

const routes: Routes = [
  {
    path: 'circles/:id',
    component: SetelShareDetailsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [
        adminCircles.adminCircleView,
        adminCircles.adminCircleList,
        adminCircles.adminCircleUpdate,
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetelShareRoutingModule {}
