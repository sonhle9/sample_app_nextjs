import {NgModule} from '@angular/core';
import {ComponentsModule} from 'src/shared/components/components.module';
import {CashflowsRoutingModule} from './cashflows-routing.module';
import {CashflowsComponent} from './components/cashflows.component';

@NgModule({
  declarations: [CashflowsComponent],
  imports: [CashflowsRoutingModule, ComponentsModule],
})
export class CashflowsModule {}
