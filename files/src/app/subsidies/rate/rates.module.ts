import {NgModule} from '@angular/core';
import {ComponentsModule} from '../../../shared/components/components.module';
import {SubsidyRatesComponent} from './components/rates.component';
import {SubsidyRateRoutingModule} from './rates-routing.module';

@NgModule({
  declarations: [SubsidyRatesComponent],
  imports: [SubsidyRateRoutingModule, ComponentsModule],
})
export class RatesModule {}
