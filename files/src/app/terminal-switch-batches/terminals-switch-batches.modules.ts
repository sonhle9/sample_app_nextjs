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
import {TerminalSwitchBatchDetailComponent} from './components/terminal-switch-batch-detail.component';
import {TerminalSwitchBatchListingComponent} from './components/terminal-switch-batch-listing.component';
import {TerminalSwitchBatchComponent} from './components/terminals-switch-batch.component';
import {TerminalSwitchBatchesRoutingModules} from './terminal-switch-batches-routing.module';

@NgModule({
  declarations: [
    TerminalSwitchBatchComponent,
    TerminalSwitchBatchListingComponent,
    TerminalSwitchBatchDetailComponent,
  ],
  imports: [
    TerminalSwitchBatchesRoutingModules,
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
export class TerminalSwitchBatches {}
