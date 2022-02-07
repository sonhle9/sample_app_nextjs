import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {MaterialModule} from './../../shared/material/material.module';
import {FuellingRoutingModule} from './fuelling.routing.module';
import {ComponentsModule} from './../../shared/components/components.module';
import {FuelPriceComponent} from './prices/fuel-price.component';
import {FuelPriceDetailsComponent} from './prices/fuel-price-details.component';

@NgModule({
  declarations: [FuelPriceComponent, FuelPriceDetailsComponent],
  imports: [CommonModule, FuellingRoutingModule, MaterialModule, FormsModule, ComponentsModule],
})
export class FuellingModule {}
