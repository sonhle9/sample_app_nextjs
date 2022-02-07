import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PipesModule} from '../../../../shared/pipes/pipes.module';
import {ComponentsModule} from '../../../../shared/components/components.module';
import {DirectivesModule} from '../../../../shared/directives/directives.module';
import {MomentModule} from 'ngx-moment';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {LedgerAdjustmentsRoutingModule} from './ledger-adjustments.routing.module';
import {LedgerAdjustmentsListComponent} from './components/ledger-adjustment/ledger-adjustments-list.component';
import {LedgerAdjustmentDetailsComponent} from './components/ledger-adjustment/ledger-adjustment-details.component';

@NgModule({
  declarations: [LedgerAdjustmentsListComponent, LedgerAdjustmentDetailsComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    LedgerAdjustmentsRoutingModule,
    MomentModule,
    NgxJsonViewerModule,
  ],
})
export class LedgerAdjustmentsModule {}
