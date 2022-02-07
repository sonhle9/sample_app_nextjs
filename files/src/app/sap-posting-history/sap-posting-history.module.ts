import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ComponentsModule} from 'src/shared/components/components.module';
import {SAPPostingHistoryDetailsComponent} from './pages/sap-posting-history-details.component';
import {SAPPostingHistoryListingComponent} from './pages/sap-posting-history-listing.component';
import {SAPPostingHistoryRoutingModule} from './sap-posting-history-routing-module';

@NgModule({
  declarations: [SAPPostingHistoryListingComponent, SAPPostingHistoryDetailsComponent],
  imports: [CommonModule, ComponentsModule, SAPPostingHistoryRoutingModule],
})
export class SAPPostingHistoryModule {}
