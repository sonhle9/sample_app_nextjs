import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {billingCreditNotesRoles} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {BillingCreditNotesListingComponent} from './components/billing-credit-notes-listing.component';

const routes: Routes = [
  {
    path: '',
    component: BillingCreditNotesListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [billingCreditNotesRoles.view],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingCreditNotesRoutingModule {}
