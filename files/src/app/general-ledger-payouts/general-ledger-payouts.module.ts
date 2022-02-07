import {NgModule} from '@angular/core';
import {GeneralLedgerPayoutsRoutingModule} from './general-ledger-payouts-routing.module';
import {GeneralLedgerPayoutsListingComponent} from './pages/general-ledger-payouts-listing.component';
import {GeneralLedgerPayoutsDetailsComponent} from './pages/general-ledger-payouts-details.component';
import {ComponentsModule} from 'src/shared/components/components.module';
import {CommonModule} from '@angular/common';
@NgModule({
  declarations: [GeneralLedgerPayoutsListingComponent, GeneralLedgerPayoutsDetailsComponent],
  imports: [CommonModule, ComponentsModule, GeneralLedgerPayoutsRoutingModule],
})
export class GeneralLedgerPayoutsModule {}
