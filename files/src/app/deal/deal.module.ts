import {NgModule} from '@angular/core';
import {DealRoutingModule} from './deal.routing';
import {DealCampaignsComponent} from './dealCampaigns.component';
import {DealCatalogueDetailsComponent} from './dealCatalogueDetails.component';
import {DealCataloguesComponent} from './dealCatalogues.component';
import {DealOrdersComponent} from './DealOrders.component';
@NgModule({
  declarations: [
    DealCampaignsComponent,
    DealOrdersComponent,
    DealCataloguesComponent,
    DealCatalogueDetailsComponent,
  ],
  imports: [DealRoutingModule],
})
export class DealModule {}
