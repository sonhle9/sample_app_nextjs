import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ApprovedAdjustmentTransactionRoutingModule} from './approved-adjustment-transactions-routing.module';
import {ApprovedAdjustmentTransactionListComponent} from './approved-adjustment-transactions-list.component';
import {ComponentsModule} from 'src/shared/components/components.module';

@NgModule({
  declarations: [ApprovedAdjustmentTransactionListComponent],
  imports: [CommonModule, ComponentsModule, ApprovedAdjustmentTransactionRoutingModule],
})
export class ApprovedAdjustmentTransactionModule {}
