import {RouterModule, Routes} from '@angular/router';
import {AuthResolver} from '../auth.guard';
import {merchantUserRole} from '../../shared/helpers/roles.type';
import {NgModule} from '@angular/core';
import {MerchantUsersListingComponent} from './pages/merchant-users-listing.component';
import {MerchantUsersDetailComponent} from './pages/merchant-users-detail.component';
import {MerchantUsersComponent} from './pages/merchant-users.component';

const routes: Routes = [
  {
    path: '',
    component: MerchantUsersComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [merchantUserRole.view],
    },
    children: [
      {
        path: '',
        component: MerchantUsersListingComponent,
        data: {
          roles: [merchantUserRole.view],
        },
      },
      {
        path: ':id',
        component: MerchantUsersDetailComponent,
        data: {
          roles: [merchantUserRole.view],
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MerchantUsersRoutingModule {}
