import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {MomentModule} from 'ngx-moment';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {TransferRoutingModule} from './transfer-routing.module';
import {TransferListComponent} from './pages/transfer-list/transfer-list.component';
import {TransferDetailsComponent} from './pages/transfer-details/transfer-details.component';
import {PaymentsTransfersDetailsComponent} from './pages/payments-transfers-details.component';
import {PaymentsTransfersListingComponent} from './pages/payments-transfers-listing.component';

@NgModule({
  declarations: [
    TransferListComponent,
    TransferDetailsComponent,
    PaymentsTransfersDetailsComponent,
    PaymentsTransfersListingComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    MomentModule,
    TransferRoutingModule,
    NgxJsonViewerModule,
  ],
})
export class TransfersModule {}
