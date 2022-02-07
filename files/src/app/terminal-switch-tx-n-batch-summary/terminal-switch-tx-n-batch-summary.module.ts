import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {MomentModule} from 'ngx-moment';
import {ComponentsModule} from '../../shared/components/components.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {SharedModule} from '../../shared/shared-module.module';
import {TerminalSwitchTxNBatchSummaryListingComponent} from './components/terminal-switch-tx-n-batch-summary-listing.component';
import {TerminalSwitchTxNBatchSummaryComponent} from './components/terminal-switch-tx-n-batch-summary.component';
import {TerminalSwitchTxNBatchSummaryRoutingModules} from './terminal-switch-tx-n-batch-summary.router';

@NgModule({
  declarations: [
    TerminalSwitchTxNBatchSummaryComponent,
    TerminalSwitchTxNBatchSummaryListingComponent,
  ],
  imports: [
    TerminalSwitchTxNBatchSummaryRoutingModules,
    ReactiveFormsModule,
    CommonModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    DirectivesModule,
    NgxJsonViewerModule,
    SharedModule,
    FlexLayoutModule,
    MomentModule,
  ],
})
export class TerminalSwitchTxNBatchSummaryModule {}
