import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {billingInvoicesRole} from 'src/shared/helpers/roles.type';
import {AuthResolver} from '../auth.guard';
import {BillingInvoicesListingComponent} from './components/billing-invoices-listing.component';

const routes: Routes = [
  {
    path: '',
    component: BillingInvoicesListingComponent,
    canActivate: [AuthResolver],
    data: {
      roles: [billingInvoicesRole.view],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingInvoicesRoutingModule {}
