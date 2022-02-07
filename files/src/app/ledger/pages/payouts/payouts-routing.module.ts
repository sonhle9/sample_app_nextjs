import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ledgerRole} from '../../../../shared/helpers/roles.type';
import {AuthResolver} from '../../../auth.guard';
import {PayoutsListingComponent} from './pages/payouts-listing.component';
import {PayoutsDetailComponent} from './pages/payouts-details.component';

const routes: Routes = [
  {
    path: ':id',
    component: PayoutsDetailComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [ledgerRole.menu, ledgerRole.read],
    },
  },
  {
    path: '',
    component: PayoutsListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [ledgerRole.menu, ledgerRole.index],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayoutsRoutingModule {}
