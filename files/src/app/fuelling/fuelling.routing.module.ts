import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthResolver} from '../auth.guard';
import {retailRoles} from '../../shared/helpers/roles.type';
import {FuelPriceComponent} from './prices/fuel-price.component';
import {FuelPriceDetailsComponent} from './prices/fuel-price-details.component';

const routes: Routes = [
  {
    path: 'fuel-prices',
    canActivate: [AuthResolver],
    data: {
      roles: [retailRoles.fuelPriceView],
    },
    component: FuelPriceComponent,
  },
  {
    path: 'fuel-price/:id',
    canActivate: [AuthResolver],
    data: {
      roles: [retailRoles.fuelPriceView],
    },
    component: FuelPriceDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FuellingRoutingModule {}
