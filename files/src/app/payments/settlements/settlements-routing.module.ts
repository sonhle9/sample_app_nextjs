import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {adminRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../../auth.guard';
import {SettlementsComponent} from './components/settlements.component';
import {SettlementsListingComponent} from './components/settlements-listing.component';

const routes: Routes = [
  {
    path: '',
    component: SettlementsComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [adminRole.userMenu],
    },
    children: [
      {
        path: '',
        component: SettlementsListingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettlementsRoutingModule {}
