import {NgModule} from '@angular/core';
import {BillingCreditNotesRoutingModule} from './billing-credit-notes-routing.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {BillingCreditNotesListingComponent} from './components/billing-credit-notes-listing.component';

@NgModule({
  declarations: [BillingCreditNotesListingComponent],
  imports: [BillingCreditNotesRoutingModule, ComponentsModule],
})
export class BillingCreditNotesModule {}
