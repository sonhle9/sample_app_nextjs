import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {rebatePlansRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {RebatePlansListingComponent} from './components/rebate-plans-listing.component';
import {RebatePlansDetailComponent} from './components/rebate-plans-detail.component';

const routes: Routes = [
  {
    path: '',
    component: RebatePlansListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [rebatePlansRole.view],
    },
  },
  {
    path: ':id',
    component: RebatePlansDetailComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [rebatePlansRole.modify],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RebatePlansRoutingModule {}
