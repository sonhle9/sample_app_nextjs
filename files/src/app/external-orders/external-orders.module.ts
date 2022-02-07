import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ExternalOrdersRoutingModule} from './external-orders-routing.module';
import {ExternalOrderDetailsComponent} from './pages/external-order-details/external-order-details.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {PipesModule} from 'src/shared/pipes/pipes.module';
import {ComponentsModule} from 'src/shared/components/components.module';
import {DirectivesModule} from 'src/shared/directives/directives.module';
import {MomentModule} from 'ngx-moment';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {SharedModule} from 'src/shared/shared-module.module';
import {BulkCsvUpdateComponent} from './pages/bulk-csv-update/bulk-csv-update.component';
import {BulkUpdateComponent} from './pages/bulk-update/bulk-update.component';
import {BulkCsvPreviewComponent} from './pages/bulk-csv-preview/bulk-csv-preview.component';
import {ExternalOrdersBulkUpdateComponent} from './pages/external-orders-bulk-update.component';

@NgModule({
  declarations: [
    ExternalOrderDetailsComponent,
    BulkCsvUpdateComponent,
    BulkUpdateComponent,
    BulkCsvPreviewComponent,
    ExternalOrdersBulkUpdateComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    MomentModule,
    NgxJsonViewerModule,
    SharedModule,
    ExternalOrdersRoutingModule,
  ],
})
export class ExternalOrdersModule {}
