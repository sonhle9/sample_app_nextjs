import {NgModule} from '@angular/core';
import {ComponentsModule} from '../../shared/components/components.module';
import {BillingPukalSedutRoutingModule} from './billing-pukal-sedut-routing.module';
import {BillingPukalSedutListingComponent} from './components/billing-pukal-sedut-listing.component';

@NgModule({
  declarations: [BillingPukalSedutListingComponent],
  imports: [BillingPukalSedutRoutingModule, ComponentsModule],
})
export class BillingPukalSedutModule {}
