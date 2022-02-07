import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MomentModule} from 'ngx-moment';

import {BalanceBatchUploadRoutingModule} from './balance-batch-upload-routing.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {BalanceBatchUploadComponent} from './pages/balanceBatchUpload/balanceBatchUpload.component';
import {BalanceBatchUploadCsvComponent} from './pages/balanceBatchUploadCsv/balanceBatchUploadCsv.component';
import {BalanceBatchUploadHistoryComponent} from './pages/balanceBatchUploadHistory/balanceBatchUploadHistory.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {MatButtonModule} from '@angular/material/button';
import {MaterialModule} from '../../shared/material/material.module';
import {WalletBalanceGrantingListingComponent} from './pages/wallet-balance-granting-listing.component';

@NgModule({
  declarations: [
    BalanceBatchUploadComponent,
    BalanceBatchUploadCsvComponent,
    BalanceBatchUploadHistoryComponent,
    WalletBalanceGrantingListingComponent,
  ],
  imports: [
    BalanceBatchUploadRoutingModule,
    MomentModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    CommonModule,
    NgxJsonViewerModule,
    NgxDatatableModule,
    MatButtonModule,
    MaterialModule,
  ],
  exports: [],
})
export class BalanceBatchUploadModule {}
