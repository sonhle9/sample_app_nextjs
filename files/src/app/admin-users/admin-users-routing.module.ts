import {RouterModule, Routes} from '@angular/router';
import {AdminUsersComponent} from './pages/admin-users.component';
import {AuthResolver} from '../auth.guard';
import {adminRole} from '../../shared/helpers/roles.type';
import {AdminsUserListingComponent} from './pages/admin-users-listing.component';
import {NgModule} from '@angular/core';
import {AdminUserDetailsComponent} from './pages/admin-user-details.component';

const routes: Routes = [
  {
    path: '',
    component: AdminUsersComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [adminRole.userMenu],
    },
    children: [
      {
        path: '',
        component: AdminsUserListingComponent,
      },
      {
        path: ':id',
        component: AdminUserDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminUsersRoutingModule {}
