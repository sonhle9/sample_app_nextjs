import {NgModule} from '@angular/core';
import {CardTransactionsListComponent} from './pages/card-transactions-list/card-transactions-list.component';
import {CardTransactionsDetailsComponent} from './pages/card-transactions-details/card-transactions-details.component';
import {CardTransactionsDetailsCardComponent} from './pages/card-transactions-details-card/card-transactions-details-card.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared-module.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MomentModule} from 'ngx-moment';
import {CardTransactionsRoutingModule} from './card-transactions-routing.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {CardTransactionDetailsTimelineComponent} from './pages/card-transactions-details-timeline/card-transactions-details-timeline';
import {CardTransactionsDetailsMerchantComponent} from './pages/card-transactions-details-merchant/card-transactions-details-merchant.component';
import {CardTransactionsDetailsItemisedComponent} from './pages/card-transactions-details-temised/card-transactions-details-itemised.component';
import {CardTransactionsSendMailModalComponent} from './pages/card-transactions-send-mail-modal/card-transactions-send-mail-modal.component';
import {SettlementBatchComponent} from './pages/settlement-batch/settlement-batch.component';
import {CardTransactionsFleetDetailsComponent} from './components/card-transactions-fleet-details.component';

@NgModule({
  declarations: [
    CardTransactionsListComponent,
    CardTransactionsDetailsComponent,
    CardTransactionsFleetDetailsComponent,
    CardTransactionsDetailsCardComponent,
    CardTransactionDetailsTimelineComponent,
    CardTransactionsDetailsMerchantComponent,
    CardTransactionsDetailsItemisedComponent,
    CardTransactionsSendMailModalComponent,
    SettlementBatchComponent,
  ],
  imports: [
    NgSelectModule,
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    CardTransactionsRoutingModule,
    SharedModule,
    FlexLayoutModule,
    MomentModule,
  ],
  entryComponents: [CardTransactionsSendMailModalComponent],
})
export class CardTransactionsModule {}
