import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GiftCardTransactionsSummaryRoutingModule} from './gift-card-transactions-summary-routing.module';
import {GiftCardTransactionsSummaryListComponent} from './gift-card-transactions-summary-list.component';
import {ComponentsModule} from 'src/shared/components/components.module';

@NgModule({
  declarations: [GiftCardTransactionsSummaryListComponent],
  imports: [CommonModule, ComponentsModule, GiftCardTransactionsSummaryRoutingModule],
})
export class GiftCardTransactionsSummaryModule {}
