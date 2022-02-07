import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MomentModule} from 'ngx-moment';

import {ReportsRoutingModule} from './reports-routing.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {WeekMetricComponent} from './pages/week-metric/week-metric';
import {ComponentsModule} from '../../shared/components/components.module';
import {ReportsComponent} from './pages/reports/reports';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {WeekMetricCustomersComponent} from './pages/week-metric-customers/week-metric-customers';
import {CustomerFunnelComponent} from './pages/customer-funnel/customer-funnel';

@NgModule({
  declarations: [
    WeekMetricComponent,
    WeekMetricCustomersComponent,
    CustomerFunnelComponent,
    ReportsComponent,
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    DirectivesModule,
    ComponentsModule,
    PipesModule,
    MomentModule,
  ],
})
export class ReportsModule {}
