import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ComponentsModule} from 'src/shared/components/components.module';
import {GeneralLedgerRoutingModule} from './general-ledger-routing.module';
import {GeneralLedgerParameterDetailsComponent} from './pages/general-ledger-parameter-details.component';
import {GeneralLedgerParameterListingComponent} from './pages/general-ledger-parameter-listing.component';

@NgModule({
  declarations: [GeneralLedgerParameterListingComponent, GeneralLedgerParameterDetailsComponent],
  imports: [GeneralLedgerRoutingModule, CommonModule, ComponentsModule],
})
export class GeneralLedgerModule {}
