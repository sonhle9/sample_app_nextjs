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
import {TerminalSwitchFailedLogsRoutingModule} from './ terminals-switch-failed-log-routing.module';
import {TerminalSwitchFailedLogComponent} from './components/ terminal-switch-failed-log.component';
import {TerminalSwitchFailedLogsDetailComponent} from './components/terminal-switch-failed-log-detail.component';
import {TerminalSwitchFailedLogsListingComponent} from './components/terminal-switch-failed-log-listing.component';

@NgModule({
  declarations: [
    TerminalSwitchFailedLogsListingComponent,
    TerminalSwitchFailedLogsDetailComponent,
    TerminalSwitchFailedLogComponent,
  ],
  imports: [
    TerminalSwitchFailedLogsRoutingModule,
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
export class TerminalSwitchFailedLogsModule {}
