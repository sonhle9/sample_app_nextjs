import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {CommonModule} from '@angular/common';
import {ComponentsModule} from '../../shared/components/components.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {MomentModule} from 'ngx-moment';
import {NgModule} from '@angular/core';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {LoyaltyCardsComponent} from './pages/loyalty-cards/loyalty-cards';
import {LoyaltyAffliateRoutingModule} from './loyalty-affliate-routing.module';
import {LoyaltyTransactionsComponent} from './pages/loyalty-transactions/loyalty-transactions';
import {TransactionsComponent} from './pages/transactions/transactions';
import {TransactionDetailsComponent} from './pages/transactions/transaction-details';
import {TransactionsRouteComponent} from './pages/transactions/transactions-route-component';
import {LoyaltyDailyComponent} from './pages/loyalty-daily/loyalty-daily';
import {LoyaltyMonthlyComponent} from './pages/loyalty-monthly/loyalty-monthly';
import {SearchLoyaltyCardsComponent} from './pages/search-loyalty-cards/search-loyalty-cards.component';
import {MaterialModule} from 'src/shared/material/material.module';

@NgModule({
  declarations: [
    LoyaltyCardsComponent,
    LoyaltyTransactionsComponent,
    LoyaltyDailyComponent,
    LoyaltyMonthlyComponent,
    SearchLoyaltyCardsComponent,
    TransactionsComponent,
    TransactionsRouteComponent,
    TransactionDetailsComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    MomentModule,
    LoyaltyAffliateRoutingModule,
    NgxJsonViewerModule,
    MaterialModule,
  ],
})
export class LoyaltyAffliateModule {}
