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
import {TerminalSwitchHourlyTnxFileDetailComponent} from './components/terminal-switch-hourly-tnx-detail.component';
import {TerminalSwitchCsvReportTabComponent} from './components/terminal-switch-csv-reports-tab.component';
import {TerminalSwitchCsvReportsComponent} from './components/terminal-switch-csv-reports.component';
import {TerminalSwitchHourlyTnxFileRouter} from './terminal-switch-csv-reports.router';

@NgModule({
  declarations: [
    TerminalSwitchCsvReportTabComponent,
    TerminalSwitchCsvReportsComponent,
    TerminalSwitchHourlyTnxFileDetailComponent,
  ],
  imports: [
    TerminalSwitchHourlyTnxFileRouter,
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
export class TerminalSwitchCsvReportsModule {}
