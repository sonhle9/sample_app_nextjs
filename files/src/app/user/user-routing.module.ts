import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthResolver} from '../auth.guard';
import {ProfileComponent} from './pages/profile/profile.component';
import {adminAccountRole} from '../../shared/helpers/roles.type';
const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [adminAccountRole.adminRead],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
