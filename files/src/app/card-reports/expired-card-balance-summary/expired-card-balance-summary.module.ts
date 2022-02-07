import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ExpiredCardBalanceSummaryRoutingModule} from './expired-card-balance-summary-routing.module';
import {ExpiredCardBalanceSummaryListComponent} from './expired-card-balance-summary-list.component';
import {ComponentsModule} from 'src/shared/components/components.module';

@NgModule({
  declarations: [ExpiredCardBalanceSummaryListComponent],
  imports: [CommonModule, ComponentsModule, ExpiredCardBalanceSummaryRoutingModule],
})
export class ExpiredCardBalanceSummaryModule {}
