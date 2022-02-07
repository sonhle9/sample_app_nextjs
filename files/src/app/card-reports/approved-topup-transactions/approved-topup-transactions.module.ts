import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ApprovedTopupTransactionsRoutingModule} from './approved-topup-transactions-routing.module';
import {ApprovedTopupTransactionsListComponent} from './approved-topup-transactions-list.component';
import {ComponentsModule} from 'src/shared/components/components.module';

@NgModule({
  declarations: [ApprovedTopupTransactionsListComponent],
  imports: [CommonModule, ComponentsModule, ApprovedTopupTransactionsRoutingModule],
})
export class ApprovedTopupTransactionsModule {}
