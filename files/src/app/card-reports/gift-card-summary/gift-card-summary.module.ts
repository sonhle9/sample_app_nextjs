import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GiftCardSummaryRoutingModule} from './gift-card-summary-routing.module';
import {GiftCardSummaryListComponent} from './gift-card-summary-list.component';
import {ComponentsModule} from 'src/shared/components/components.module';

@NgModule({
  declarations: [GiftCardSummaryListComponent],
  imports: [CommonModule, ComponentsModule, GiftCardSummaryRoutingModule],
})
export class GiftCardSummaryModule {}
