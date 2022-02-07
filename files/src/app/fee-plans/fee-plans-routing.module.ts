import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {feePlansRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {FeePlansListingComponent} from './components/fee-plans-listing.component';
import {FeePlansDetailComponent} from './components/fee-plans-detail.component';

const routes: Routes = [
  {
    path: '',
    component: FeePlansListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [feePlansRole.view],
    },
  },
  {
    path: ':id',
    component: FeePlansDetailComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [feePlansRole.modify],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeePlansRoutingModule {}
