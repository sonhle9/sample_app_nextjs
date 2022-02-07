import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {DirectivesModule} from '../../shared/directives/directives.module';
import {TransactionsRoutingModule} from './transactions-routing.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {MomentModule} from 'ngx-moment';
import {TransactionsComponent} from './pages/transactions/transactions';
import {TransactionDetailsComponent} from './pages/transaction-details/transaction-details';
import {LoyaltyTransactionDetailsComponent} from './pages/loyalty-transaction-details/loyalty-transaction-details';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {PaymentsTransactionsListingComponent} from './pages/payments-transactions-listing.component';
import {PaymentsTransactionsDetailsComponent} from './pages/payments-transactions-details.component';

@NgModule({
  declarations: [
    TransactionsComponent,
    LoyaltyTransactionDetailsComponent,
    TransactionDetailsComponent,
    PaymentsTransactionsListingComponent,
    PaymentsTransactionsDetailsComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    MomentModule,
    TransactionsRoutingModule,
    NgxJsonViewerModule,
  ],
})
export class TransactionsModule {}
