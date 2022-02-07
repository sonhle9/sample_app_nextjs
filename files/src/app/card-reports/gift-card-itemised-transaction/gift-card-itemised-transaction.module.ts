import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentsModule} from 'src/shared/components/components.module';
import {GiftCardItemisedTransactionRoutingModule} from './gift-card-itemised-transaction-routing.module';
import {GiftCardItemisedTransactionListComponent} from './gift-card-itemised-transaction-list.component';

@NgModule({
  declarations: [GiftCardItemisedTransactionListComponent],
  imports: [CommonModule, ComponentsModule, GiftCardItemisedTransactionRoutingModule],
})
export class GiftCardItemisedTransactionModule {}
