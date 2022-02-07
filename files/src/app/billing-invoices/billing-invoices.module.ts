import {NgModule} from '@angular/core';
import {BillingInvoicesRoutingModule} from './billing-invoices-routing.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {BillingInvoicesListingComponent} from './components/billing-invoices-listing.component';

@NgModule({
  declarations: [BillingInvoicesListingComponent],
  imports: [BillingInvoicesRoutingModule, ComponentsModule],
})
export class BillingInvoicesModule {}
