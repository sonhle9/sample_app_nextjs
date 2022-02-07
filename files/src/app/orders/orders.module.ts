import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {MomentModule} from 'ngx-moment';
import {SharedModule} from 'src/shared/shared-module.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {MaterialModule} from '../../shared/material/material.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {OrderManualReleaseConfirmDialogComponent} from './components/order-manual-release/order-manual-release-confirm-dialog.component';
import {OrderManualReleaseComponent} from './components/order-manual-release/order-manual-release.component';
import {OrderTagsComponent} from './components/order-tags/order-tags.component';
import {OrdersRoutingModule} from './orders-routing.module';
import {OrderDetailsComponent} from './pages/orderDetails/orderDetails';
import {OrderLoyaltyTransactionsComponent} from './pages/orderLoyaltyTransactions/orderLoyaltyTransactions';
import {OrdersDialogComponent} from './pages/orders-dialog/orders-dialog.component';
import {FuelOrdersReportsDownloadComponent} from './pages/orders-reports-download.component';
import {OrdersComponent} from './pages/orders/orders';
import {OrderTransactionsComponent} from './pages/orderTransactions/orderTransactions';

@NgModule({
  declarations: [
    OrdersComponent,
    OrderDetailsComponent,
    OrderTransactionsComponent,
    OrderLoyaltyTransactionsComponent,
    OrdersDialogComponent,
    OrderTagsComponent,
    OrderManualReleaseComponent,
    OrderManualReleaseConfirmDialogComponent,
    FuelOrdersReportsDownloadComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    MomentModule,
    OrdersRoutingModule,
    NgxJsonViewerModule,
    SharedModule,
    MaterialModule,
  ],
  exports: [OrderLoyaltyTransactionsComponent],
  entryComponents: [OrdersDialogComponent, OrderManualReleaseConfirmDialogComponent],
})
export class OrdersModule {}
