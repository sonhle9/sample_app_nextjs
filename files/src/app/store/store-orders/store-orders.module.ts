import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {CommonModule} from '@angular/common';
import {ComponentsModule} from '../../../shared/components/components.module';
import {DirectivesModule} from '../../../shared/directives/directives.module';
import {MomentModule} from 'ngx-moment';
import {NgModule} from '@angular/core';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import {SharedModule} from '../../../shared/shared-module.module';
import {StoreOrdersRoutingModule} from './store-orders.routing.module';
import {OverCounterOrderDetailsComponent} from './pages/over-counter-order-details/over-counter-order-details.component';
import {Deliver2MeOrderDetailsComponent} from './pages/deliver2me-order-details/deliver2me-order-details.component';
import {StoreOrderListComponent} from './pages/store-order-list/store-order-list.component';

@NgModule({
  declarations: [
    OverCounterOrderDetailsComponent,
    Deliver2MeOrderDetailsComponent,
    StoreOrderListComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    MomentModule,
    StoreOrdersRoutingModule,
    NgxJsonViewerModule,
    SharedModule,
  ],
})
export class StoreOrdersModule {}
