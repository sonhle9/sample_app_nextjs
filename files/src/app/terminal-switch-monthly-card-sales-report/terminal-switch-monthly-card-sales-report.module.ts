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
import {TerminalSwitchMonthlyCardSalesReportComponent} from './components/terminal-switch-monthly-card-sales-report.component';
import {TerminalSwitchMonthlyCardSalesReportListingComponent} from './components/terminal-switch-monthy-card-sales-report-listing.component';
import {TerminalSwitchMonthlyCardSalesReportRouter} from './terminal-switch-monthly-card-sales-report.router';

@NgModule({
  declarations: [
    TerminalSwitchMonthlyCardSalesReportComponent,
    TerminalSwitchMonthlyCardSalesReportListingComponent,
  ],
  imports: [
    TerminalSwitchMonthlyCardSalesReportRouter,
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
export class TerminalSwitchMonthlyCardSalesReportModule {}
