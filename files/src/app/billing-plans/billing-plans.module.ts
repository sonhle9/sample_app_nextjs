import {NgModule} from '@angular/core';
import {BillingPlansListingComponent} from './components/billing-plans-listing.component';
import {BillingPlansRoutingModule} from './billing-plans-routing.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {BillingPlansDetailComponent} from './components/billing-plans-detail.component';

@NgModule({
  declarations: [BillingPlansListingComponent, BillingPlansDetailComponent],
  imports: [BillingPlansRoutingModule, ComponentsModule],
})
export class BillingPlansModule {}
