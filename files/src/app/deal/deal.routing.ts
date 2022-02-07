import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DealCampaignsComponent} from './dealCampaigns.component';
import {DealCatalogueDetailsComponent} from './dealCatalogueDetails.component';
import {DealCataloguesComponent} from './dealCatalogues.component';
import {DealOrdersComponent} from './DealOrders.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'deal-campaigns',
        component: DealCampaignsComponent,
      },
      {
        path: 'deal-orders',
        component: DealOrdersComponent,
      },
      {
        path: 'deal-catalogues',
        component: DealCataloguesComponent,
      },
      {
        path: 'deal-catalogues/:catalogueId',
        component: DealCatalogueDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DealRoutingModule {}
