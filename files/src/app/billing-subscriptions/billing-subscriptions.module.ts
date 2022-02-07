import {NgModule} from '@angular/core';
import {BillingSubscriptionsRoutingModule} from './billing-subscriptions-routing.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {BillingSubscriptionsDetailsComponent} from './components/billing-subscriptions-details.component';
import {BillingSubscriptionsListingComponent} from './components/billing-subscriptions-listing.component';

@NgModule({
  declarations: [BillingSubscriptionsListingComponent, BillingSubscriptionsDetailsComponent],
  imports: [BillingSubscriptionsRoutingModule, ComponentsModule],
})
export class BillingSubscriptionsModule {}
