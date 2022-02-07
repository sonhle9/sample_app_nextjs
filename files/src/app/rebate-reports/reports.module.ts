import {NgModule} from '@angular/core';
import {RebateReportsComponent} from './components/rebate-plans-listing.component';
import {ComponentsModule} from '../../shared/components/components.module';
import {ReportsRoutingModule} from './reports-routing.module';
import {ReportsComponent} from './components/reports.component';

@NgModule({
  declarations: [RebateReportsComponent, ReportsComponent],
  imports: [ReportsRoutingModule, ComponentsModule],
})
export class ReportsModule {}
