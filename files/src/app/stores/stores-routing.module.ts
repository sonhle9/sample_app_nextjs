import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {StoresListComponent} from './pages/stores-list/stores-list.component';
import {AuthResolver} from '../auth.guard';
import {retailRoles} from '../../shared/helpers/roles.type';
import {StoreDetailsComponent} from './pages/store-details/store-details';

const routes: Routes = [
  {
    path: '',
    component: StoresListComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [retailRoles.storeView],
    },
  },
  {
    path: ':storeId',
    canActivate: [AuthResolver],
    data: {
      roles: [retailRoles.storeView],
    },
    children: [
      {
        path: '',
        redirectTo: 'details',
      },
      {
        path: ':tab',
        component: StoreDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoresRoutingModule {}
