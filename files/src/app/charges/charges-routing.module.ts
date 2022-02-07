import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthResolver} from '../auth.guard';
import {ChargesComponent} from './pages/charges/charges';
import {PaymentsChargesListingComponent} from './pages/payments-charges-listing.component';
import {merchantRole} from 'src/shared/helpers/roles.type';

const routes: Routes = [
  {
    path: '',
    component: ChargesComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [merchantRole.view],
    },
  },
  {
    path: 'listing',
    component: PaymentsChargesListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [merchantRole.view],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChargesRoutingModule {}
