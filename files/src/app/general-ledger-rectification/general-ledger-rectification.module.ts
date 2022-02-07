import {NgModule} from '@angular/core';
import {GeneralLedgerRoutingModule} from './general-ledger-rectification-routing.module';
import {GeneralLedgerRectificationListingComponent} from './pages/general-ledger-rectification-listing.component';
import {GeneralLedgerRectificationDetailsComponent} from './pages/general-ledger-rectification-details.component';
import {CommonModule} from '@angular/common';
import {ComponentsModule} from 'src/shared/components/components.module';
@NgModule({
  declarations: [
    GeneralLedgerRectificationListingComponent,
    GeneralLedgerRectificationDetailsComponent,
  ],
  imports: [GeneralLedgerRoutingModule, CommonModule, ComponentsModule],
})
export class GeneralLedgerRectificationModule {}
