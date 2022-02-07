import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ComponentsModule} from 'src/shared/components/components.module';
import {PayoutsDetailComponent} from './pages/payouts-details.component';
import {PayoutsListingComponent} from './pages/payouts-listing.component';
import {PayoutsRoutingModule} from './payouts-routing.module';

@NgModule({
  declarations: [PayoutsListingComponent, PayoutsDetailComponent],
  imports: [CommonModule, ComponentsModule, PayoutsRoutingModule],
})
export class PayoutsModule {}
