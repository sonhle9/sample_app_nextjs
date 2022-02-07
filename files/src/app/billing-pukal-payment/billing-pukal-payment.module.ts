import {NgModule} from '@angular/core';
import {ComponentsModule} from '../../shared/components/components.module';
import {BillingPukalPaymentRoutingModule} from './billing-pukal-payment-routing.module';
import {BillingPukalPaymentAllocationComponent} from './components/billing-pukal-payment-allocation.component';
import {BillingPukalPaymentDetailComponent} from './components/billing-pukal-payment-detail.component';
import {BillingPukalPaymentListingComponent} from './components/billing-pukal-payment-listing.component';

@NgModule({
  declarations: [
    BillingPukalPaymentListingComponent,
    BillingPukalPaymentDetailComponent,
    BillingPukalPaymentAllocationComponent,
  ],
  imports: [BillingPukalPaymentRoutingModule, ComponentsModule],
})
export class BillingPukalPaymentModule {}
