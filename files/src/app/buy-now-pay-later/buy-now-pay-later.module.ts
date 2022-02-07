import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ComponentsModule} from '../../shared/components/components.module';
import {BuyNowPayLaterRoutingModule} from './buy-now-pay-later-routing.module';
import {BNPLAccountListingComponent} from './pages/account-listing.component';
import {BNPLBillListingComponent} from './pages/bill-listing.component';
import {BNPLPlanListingComponent} from './pages/plan-listing.component';
import {BNPLInstructionListingComponent} from './pages/instruction-listing.component';
import {PlanDetailsComponent} from './pages/plan-details.component';
import {BNPLAccountDetailsComponent} from './pages/account-details.component';

@NgModule({
  declarations: [
    BNPLAccountListingComponent,
    BNPLAccountDetailsComponent,
    BNPLBillListingComponent,
    BNPLInstructionListingComponent,
    BNPLPlanListingComponent,
    PlanDetailsComponent,
  ],
  imports: [CommonModule, ComponentsModule, BuyNowPayLaterRoutingModule],
  exports: [],
  entryComponents: [],
})
export class BuyNowPayLaterModule {}
