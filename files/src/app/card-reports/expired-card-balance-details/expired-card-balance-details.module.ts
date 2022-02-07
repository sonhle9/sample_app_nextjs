import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ExpiredCardBalanceDetailsRoutingModule} from './expired-card-balance-details-routing.module';
import {ExpiredCardBalanceDetailsListComponent} from './expired-card-balance-details-list.component';
import {ComponentsModule} from 'src/shared/components/components.module';

@NgModule({
  declarations: [ExpiredCardBalanceDetailsListComponent],
  imports: [CommonModule, ComponentsModule, ExpiredCardBalanceDetailsRoutingModule],
})
export class ExpiredCardBalanceDetailsModule {}
