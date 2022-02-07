import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {MomentModule} from 'ngx-moment';
import {ComponentsModule} from '../../../../shared/components/components.module';
import {DirectivesModule} from '../../../../shared/directives/directives.module';
import {PipesModule} from '../../../../shared/pipes/pipes.module';
import {SharedModule} from '../../../../shared/shared-module.module';
import {CalculateProjectionModalComponent} from './pages/payout-projection/components/calculate-projection-modal.component';

import {PayoutProjectionComponent} from './pages/payout-projection/payout-projection.component';
import {ReportsRoutingModule} from './reports-routing.module';
import {PayablesReportComponent} from './pages/payables/payables.component';
import {PayablesDetailComponent} from './pages/payables-details/payables-detail.component';
import {ReceivablesDetailsComponent} from './pages/receivables-details/receivables-details.component';
import {ReceivablesListComponent} from './pages/receivables/receivables-list.component';
@NgModule({
  declarations: [
    ReceivablesListComponent,
    ReceivablesDetailsComponent,
    PayoutProjectionComponent,
    CalculateProjectionModalComponent,
    PayablesReportComponent,
    PayablesDetailComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    MomentModule,
    ReportsRoutingModule,
    NgxJsonViewerModule,
    SharedModule,
  ],
  entryComponents: [CalculateProjectionModalComponent],
})
export class ReportsModule {}
