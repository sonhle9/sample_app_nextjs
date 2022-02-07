import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MomentModule} from 'ngx-moment';

import {ReportsRoutingModule} from './dashboard-routing.module';
import {DirectivesModule} from '../../shared/directives/directives.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {DashboardComponent} from './pages/dashboard/dashboard';

@NgModule({
  declarations: [DashboardComponent],
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
export class DashboardModule {}
